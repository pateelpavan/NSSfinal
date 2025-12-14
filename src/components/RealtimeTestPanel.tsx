import React, { useState } from 'react';
import { supabaseService } from '../lib/supabaseService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const RealtimeTestPanel: React.FC = () => {
  const [testData, setTestData] = useState({
    fullName: '',
    rollNumber: '',
    branch: '',
    password: 'test123'
  });

  const [isLoading, setIsLoading] = useState(false);

  const addTestUser = async () => {
    if (!testData.fullName || !testData.rollNumber || !testData.branch) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const qrCode = `QR_${Date.now()}`;
      const joinDate = new Date().toISOString().split('T')[0];

      await supabaseService.user.create({
        full_name: testData.fullName,
        roll_number: testData.rollNumber,
        branch: testData.branch,
        password: testData.password,
        qr_code: qrCode,
        join_date: joinDate,
        is_approved: false
      });

      setTestData({ fullName: '', rollNumber: '', branch: '', password: 'test123' });
      alert('User created! Check console for real-time updates.');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    } finally {
      setIsLoading(false);
    }
  };

  const addTestEvent = async () => {
    setIsLoading(true);
    try {
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 7); // Next week

      await supabaseService.event.create({
        title: `Test Event ${Date.now()}`,
        description: 'This is a test event created to demonstrate real-time functionality',
        event_date: eventDate.toISOString().split('T')[0],
        start_date: eventDate.toISOString().split('T')[0],
        end_date: eventDate.toISOString().split('T')[0],
        created_by: 'test_admin'
      });

      alert('Event created! Check console for real-time updates.');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    } finally {
      setIsLoading(false);
    }
  };

  const addTestAchievement = async () => {
    setIsLoading(true);
    try {
      // Get the first user to add achievement to
      const users = await supabaseService.user.getAll();
      if (users.length === 0) {
        alert('No users found. Create a user first.');
        return;
      }

      await supabaseService.achievement.create({
        user_id: users[0].id,
        title: `Test Achievement ${Date.now()}`,
        description: 'This is a test achievement to demonstrate real-time functionality',
        level: 'district',
        achievement_date: new Date().toISOString().split('T')[0],
        is_verified: false
      });

      alert('Achievement created! Check console for real-time updates.');
    } catch (error) {
      console.error('Error creating achievement:', error);
      alert('Error creating achievement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🔄 Real-time Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Use this panel to test real-time functionality. Watch the console for live updates!
        </div>

        {/* Test User Creation */}
        <div className="space-y-2">
          <h4 className="font-medium">Test User Creation</h4>
          <Input
            placeholder="Full Name"
            value={testData.fullName}
            onChange={(e) => setTestData(prev => ({ ...prev, fullName: e.target.value }))}
          />
          <Input
            placeholder="Roll Number"
            value={testData.rollNumber}
            onChange={(e) => setTestData(prev => ({ ...prev, rollNumber: e.target.value }))}
          />
          <Input
            placeholder="Branch"
            value={testData.branch}
            onChange={(e) => setTestData(prev => ({ ...prev, branch: e.target.value }))}
          />
          <Button 
            onClick={addTestUser} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating...' : 'Create Test User'}
          </Button>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Quick Tests</h4>
          <div className="space-y-2">
            <Button 
              onClick={addTestEvent} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Test Event'}
            </Button>
            <Button 
              onClick={addTestAchievement} 
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Test Achievement'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          💡 Open browser console to see real-time updates
        </div>
      </CardContent>
    </Card>
  );
};

