// QR Code Management System for NSS Volunteers
// This file provides comprehensive QR code functionality

const { pool, queries, dbUtils } = require('./config');
const QRCode = require('qrcode');

class QRCodeManager {
  constructor() {
    this.defaultExpirationDays = 365;
    this.qrCodeTypes = {
      USER_PROFILE: 'user_profile',
      EVENT_REGISTRATION: 'event_registration',
      ACHIEVEMENT: 'achievement',
      CERTIFICATE: 'certificate',
      CUSTOM: 'custom'
    };
  }

  // Generate QR code for user profile
  async generateUserQRCode(userId, adminId, options = {}) {
    try {
      const connection = await pool.getConnection();
      
      // Get user details
      const [userRows] = await connection.execute(queries.users.getById, [userId]);
      if (userRows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = userRows[0];
      const qrData = dbUtils.generateUserQRData(user);
      const expiresAt = options.expiresDays ? 
        dbUtils.getQRExpirationDate(options.expiresDays) : 
        dbUtils.getQRExpirationDate(this.defaultExpirationDays);
      
      // Generate QR code image
      const qrImageUrl = await this.generateQRImage(qrData, options);
      
      // Deactivate existing QR codes for this user
      await connection.execute(queries.qrCodes.deactivate, [userId]);
      
      // Create new QR code record
      const qrId = dbUtils.generateUUID();
      await connection.execute(queries.qrCodes.create, [
        qrId,
        userId,
        qrData,
        qrImageUrl,
        this.qrCodeTypes.USER_PROFILE,
        null, // related_id
        null, // related_type
        adminId,
        expiresAt,
        true, // is_active
        JSON.stringify(options.metadata || {})
      ]);
      
      // Update user QR code fields
      await connection.execute(
        `UPDATE users SET 
         qr_code = ?, 
         qr_code_data = ?, 
         qr_code_generated_at = NOW(), 
         qr_code_expires_at = ?, 
         qr_code_status = 'active' 
         WHERE id = ?`,
        [qrData, qrData, expiresAt, userId]
      );
      
      connection.release();
      
      return {
        success: true,
        qrId,
        qrData,
        qrImageUrl,
        expiresAt
      };
    } catch (error) {
      console.error('Error generating user QR code:', error);
      throw error;
    }
  }

  // Generate QR code for event registration
  async generateEventQRCode(eventId, userId, adminId, options = {}) {
    try {
      const connection = await pool.getConnection();
      
      // Get event and user details
      const [eventRows] = await connection.execute(queries.events.getById, [eventId]);
      const [userRows] = await connection.execute(queries.users.getById, [userId]);
      
      if (eventRows.length === 0) throw new Error('Event not found');
      if (userRows.length === 0) throw new Error('User not found');
      
      const qrData = dbUtils.generateEventQRData(eventId, userId);
      const expiresAt = options.expiresDays ? 
        dbUtils.getQRExpirationDate(options.expiresDays) : 
        dbUtils.getQRExpirationDate(30); // Events expire in 30 days
      
      // Generate QR code image
      const qrImageUrl = await this.generateQRImage(qrData, options);
      
      // Create QR code record
      const qrId = dbUtils.generateUUID();
      await connection.execute(queries.qrCodes.create, [
        qrId,
        userId,
        qrData,
        qrImageUrl,
        this.qrCodeTypes.EVENT_REGISTRATION,
        eventId,
        'event',
        adminId,
        expiresAt,
        true,
        JSON.stringify({
          eventTitle: eventRows[0].title,
          eventDate: eventRows[0].event_date,
          ...options.metadata
        })
      ]);
      
      connection.release();
      
      return {
        success: true,
        qrId,
        qrData,
        qrImageUrl,
        expiresAt
      };
    } catch (error) {
      console.error('Error generating event QR code:', error);
      throw error;
    }
  }

  // Generate QR code for achievement
  async generateAchievementQRCode(achievementId, userId, adminId, options = {}) {
    try {
      const connection = await pool.getConnection();
      
      // Get achievement and user details
      const [achievementRows] = await connection.execute(
        'SELECT * FROM achievements WHERE id = ?', [achievementId]
      );
      const [userRows] = await connection.execute(queries.users.getById, [userId]);
      
      if (achievementRows.length === 0) throw new Error('Achievement not found');
      if (userRows.length === 0) throw new Error('User not found');
      
      const qrData = dbUtils.generateAchievementQRData(achievementId, userId);
      const expiresAt = options.expiresDays ? 
        dbUtils.getQRExpirationDate(options.expiresDays) : 
        dbUtils.getQRExpirationDate(this.defaultExpirationDays);
      
      // Generate QR code image
      const qrImageUrl = await this.generateQRImage(qrData, options);
      
      // Create QR code record
      const qrId = dbUtils.generateUUID();
      await connection.execute(queries.qrCodes.create, [
        qrId,
        userId,
        qrData,
        qrImageUrl,
        this.qrCodeTypes.ACHIEVEMENT,
        achievementId,
        'achievement',
        adminId,
        expiresAt,
        true,
        JSON.stringify({
          achievementTitle: achievementRows[0].title,
          achievementLevel: achievementRows[0].level,
          achievementDate: achievementRows[0].achievement_date,
          ...options.metadata
        })
      ]);
      
      connection.release();
      
      return {
        success: true,
        qrId,
        qrData,
        qrImageUrl,
        expiresAt
      };
    } catch (error) {
      console.error('Error generating achievement QR code:', error);
      throw error;
    }
  }

  // Generate QR code image
  async generateQRImage(qrData, options = {}) {
    try {
      const qrOptions = {
        type: 'png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: options.darkColor || '#000000',
          light: options.lightColor || '#FFFFFF'
        },
        width: options.width || 256,
        ...options.qrOptions
      };
      
      // Generate QR code as base64
      const qrCodeBase64 = await QRCode.toDataURL(qrData, qrOptions);
      
      // In a real application, you would save this to a file storage service
      // For now, we'll return the base64 data URL
      return qrCodeBase64;
    } catch (error) {
      console.error('Error generating QR code image:', error);
      throw error;
    }
  }

  // Scan QR code
  async scanQRCode(qrData, scanInfo = {}) {
    try {
      const connection = await pool.getConnection();
      
      // Find the QR code
      const [qrRows] = await connection.execute(queries.qrCodes.getByQrData, [qrData]);
      
      if (qrRows.length === 0) {
        // Log invalid scan
        await this.logScan(null, scanInfo, 'invalid');
        return {
          success: false,
          result: 'invalid',
          message: 'QR code not found'
        };
      }
      
      const qrCode = qrRows[0];
      
      // Check if QR code is active
      if (!qrCode.is_active) {
        await this.logScan(qrCode.id, scanInfo, 'revoked');
        return {
          success: false,
          result: 'revoked',
          message: 'QR code has been revoked'
        };
      }
      
      // Check if QR code has expired
      if (qrCode.expires_at && new Date(qrCode.expires_at) < new Date()) {
        await this.logScan(qrCode.id, scanInfo, 'expired');
        return {
          success: false,
          result: 'expired',
          message: 'QR code has expired'
        };
      }
      
      // Get user details
      const [userRows] = await connection.execute(queries.users.getById, [qrCode.user_id]);
      const user = userRows[0];
      
      // Update scan count
      await connection.execute(
        'UPDATE qr_codes SET scan_count = scan_count + 1, last_scanned_at = NOW(), last_scanned_by = ? WHERE id = ?',
        [scanInfo.scannedBy || 'unknown', qrCode.id]
      );
      
      // Log successful scan
      await this.logScan(qrCode.id, scanInfo, 'success');
      
      connection.release();
      
      return {
        success: true,
        result: 'success',
        user: {
          id: user.id,
          fullName: user.full_name,
          rollNumber: user.roll_number,
          branch: user.branch,
          profilePhoto: user.profile_photo,
          joinDate: user.join_date,
          isApproved: user.is_approved
        },
        qrCode: {
          id: qrCode.id,
          type: qrCode.qr_code_type,
          generatedAt: qrCode.generated_at,
          expiresAt: qrCode.expires_at,
          scanCount: qrCode.scan_count + 1,
          metadata: qrCode.metadata ? JSON.parse(qrCode.metadata) : null
        }
      };
    } catch (error) {
      console.error('Error scanning QR code:', error);
      throw error;
    }
  }

  // Log QR code scan
  async logScan(qrCodeId, scanInfo, result) {
    try {
      const connection = await pool.getConnection();
      
      const scanId = dbUtils.generateUUID();
      await connection.execute(queries.qrScans.create, [
        scanId,
        qrCodeId,
        scanInfo.scannedBy || 'unknown',
        scanInfo.scanLocation || 'unknown',
        scanInfo.ipAddress || 'unknown',
        scanInfo.userAgent || 'unknown',
        result,
        JSON.stringify(scanInfo.scanData || {})
      ]);
      
      connection.release();
    } catch (error) {
      console.error('Error logging QR code scan:', error);
      // Don't throw error for logging failures
    }
  }

  // Get QR code analytics
  async getQRAnalytics(days = 30) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(queries.qrScans.getAnalytics, [days]);
      
      connection.release();
      
      return {
        success: true,
        analytics: rows
      };
    } catch (error) {
      console.error('Error getting QR analytics:', error);
      throw error;
    }
  }

  // Get user's QR codes
  async getUserQRCodes(userId) {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(queries.qrCodes.getByUserId, [userId]);
      
      connection.release();
      
      return {
        success: true,
        qrCodes: rows
      };
    } catch (error) {
      console.error('Error getting user QR codes:', error);
      throw error;
    }
  }

  // Revoke QR code
  async revokeQRCode(qrCodeId, adminId, reason = '') {
    try {
      const connection = await pool.getConnection();
      
      // Get QR code details
      const [qrRows] = await connection.execute('SELECT * FROM qr_codes WHERE id = ?', [qrCodeId]);
      if (qrRows.length === 0) {
        throw new Error('QR code not found');
      }
      
      const qrCode = qrRows[0];
      
      // Deactivate QR code
      await connection.execute(queries.qrCodes.deactivate, [qrCodeId]);
      
      // Update user QR status if it's a user profile QR code
      if (qrCode.qr_code_type === this.qrCodeTypes.USER_PROFILE) {
        await connection.execute(
          'UPDATE users SET qr_code_status = ? WHERE id = ?',
          ['revoked', qrCode.user_id]
        );
      }
      
      // Log the action
      await connection.execute(
        'INSERT INTO audit_logs (id, admin_id, action, table_name, record_id, new_values) VALUES (?, ?, ?, ?, ?, ?)',
        [
          dbUtils.generateUUID(),
          adminId,
          'REVOKE_QR_CODE',
          'qr_codes',
          qrCodeId,
          JSON.stringify({ reason, user_id: qrCode.user_id })
        ]
      );
      
      connection.release();
      
      return {
        success: true,
        message: 'QR code revoked successfully'
      };
    } catch (error) {
      console.error('Error revoking QR code:', error);
      throw error;
    }
  }

  // Get QR code statistics
  async getQRStatistics() {
    try {
      const connection = await pool.getConnection();
      
      const [rows] = await connection.execute(queries.statistics.qrCodeStats);
      
      connection.release();
      
      return {
        success: true,
        statistics: rows
      };
    } catch (error) {
      console.error('Error getting QR statistics:', error);
      throw error;
    }
  }

  // Clean up expired QR codes
  async cleanupExpiredQRCodes() {
    try {
      const connection = await pool.getConnection();
      
      // Deactivate expired QR codes
      const [result] = await connection.execute(
        'UPDATE qr_codes SET is_active = FALSE WHERE expires_at < NOW() AND is_active = TRUE'
      );
      
      // Update user QR status for expired user profile QR codes
      await connection.execute(
        `UPDATE users u 
         JOIN qr_codes qc ON u.id = qc.user_id 
         SET u.qr_code_status = 'expired' 
         WHERE qc.expires_at < NOW() 
         AND qc.is_active = FALSE 
         AND qc.qr_code_type = 'user_profile'`
      );
      
      connection.release();
      
      return {
        success: true,
        deactivatedCount: result.affectedRows,
        message: `Deactivated ${result.affectedRows} expired QR codes`
      };
    } catch (error) {
      console.error('Error cleaning up expired QR codes:', error);
      throw error;
    }
  }
}

module.exports = QRCodeManager;
