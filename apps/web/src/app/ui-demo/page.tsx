'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { 
  Button, 
  Input, 
  Select, 
  Textarea, 
  Modal, 
  LoadingSpinner, 
  Label, 
  Checkbox,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress 
} from '@/components/ui';

export default function UIComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
    subscribe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCheckboxChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Form submitted successfully!');
    setIsLoading(false);
    setIsModalOpen(false);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UI Components Demo</h1>
          <p className="text-gray-600 mt-2">
            Showcase of the new reusable UI components
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange('name')}
              />
              
              <Select
                label="Category"
                value={formData.category}
                onChange={handleInputChange('category')}
                placeholder="Choose a category"
              >
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="sales">Sales</option>
                <option value="feedback">Feedback</option>
              </Select>

              <Textarea
                label="Message"
                placeholder="Enter your message..."
                value={formData.message}
                onChange={handleInputChange('message')}
                rows={3}
              />

              <Checkbox
                label="Subscribe to newsletter"
                checked={formData.subscribe}
                onChange={handleCheckboxChange('subscribe')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buttons & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button className="w-full">Primary Button</Button>
                <Button variant="outline" className="w-full">
                  Outline Button
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Modal
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={simulateLoading}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Loading...</span>
                    </>
                  ) : (
                    'Test Loading State'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Status Badges</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Active</Badge>
                  <Badge variant="secondary">Pending</Badge>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Progress Indicators</Label>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Project A</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Project B</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="mt-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Loading States</Label>
                <div className="flex items-center space-x-4">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Validation Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Form Validation Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                error="Please enter a valid email address"
              />
              
              <Select
                label="Country"
                error="Please select your country"
                placeholder="Choose your country"
              >
                <option value="uk">United Kingdom</option>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
              </Select>

              <div className="md:col-span-2">
                <Textarea
                  label="Feedback"
                  placeholder="Share your thoughts..."
                  helperText="This field is optional but appreciated"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal Demo */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Demo Form Modal"
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Enter your full name"
              required
            />

            <Input
              type="email"
              label="Email Address *"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email"
              required
            />

            <Select
              label="Inquiry Type"
              value={formData.category}
              onChange={handleInputChange('category')}
              placeholder="Select inquiry type"
            >
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="sales">Sales Question</option>
              <option value="feedback">Feedback</option>
            </Select>

            <Textarea
              label="Message"
              value={formData.message}
              onChange={handleInputChange('message')}
              placeholder="How can we help you?"
              rows={4}
            />

            <Checkbox
              label="I agree to receive email updates"
              checked={formData.subscribe}
              onChange={handleCheckboxChange('subscribe')}
            />

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  'Submit Form'
                )}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}