import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const CreateMeetup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'social',
    maxAttendees: '',
    isPrivate: false
  });

  const categories = [
    { id: 'social', label: 'Social', color: 'bg-blue-500' },
    { id: 'outdoor', label: 'Outdoor', color: 'bg-green-500' },
    { id: 'food', label: 'Food & Drink', color: 'bg-orange-500' },
    { id: 'sports', label: 'Sports', color: 'bg-red-500' },
    { id: 'culture', label: 'Culture', color: 'bg-purple-500' },
    { id: 'business', label: 'Business', color: 'bg-gray-500' }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    // Here you would typically submit to your backend
    console.log('Creating meetup:', formData);
    navigate('/meetups');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-subtle px-4 py-6 mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-light hover:text-slate transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate">{t('meetups.create')}</h1>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-8 h-2 rounded-full transition-colors ${
                    stepNumber <= step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-premium p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-light mb-2 block">
                    Meetup Title
                  </label>
                  <Input
                    type="text"
                    placeholder="What's your meetup about?"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-light mb-2 block">
                    Description
                  </label>
                  <Textarea
                    placeholder="Tell people what to expect..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-premium resize-none h-24"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-light mb-3 block">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleInputChange('category', category.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.category === category.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-border-light'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <span className="font-medium">{category.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={nextStep}
              disabled={!formData.title || !formData.description}
              className="w-full btn-premium"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Date & Location */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-premium p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate">When & Where</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-light mb-2 block flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Date</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="input-premium"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-light mb-2 block flex items-center space-x-1">
                      <Clock size={14} />
                      <span>Time</span>
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-light mb-2 block flex items-center space-x-1">
                    <MapPin size={14} />
                    <span>Location</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Where will you meet?"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-light mb-2 block flex items-center space-x-1">
                    <Users size={14} />
                    <span>Max Attendees (optional)</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="How many people can join?"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    className="input-premium"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!formData.date || !formData.time || !formData.location}
                className="flex-1 btn-premium"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Privacy & Confirmation */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-premium p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate">Privacy & Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
                  <div className="flex items-center space-x-3">
                    {formData.isPrivate ? (
                      <Lock size={20} className="text-slate-light" />
                    ) : (
                      <Globe size={20} className="text-slate-light" />
                    )}
                    <div>
                      <p className="font-medium text-slate">Private Meetup</p>
                      <p className="text-sm text-slate-light">
                        Only invited friends can see and join
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card-premium p-6 space-y-4">
              <h3 className="font-semibold text-slate">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-light">Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Date:</span>
                  <span className="font-medium">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Location:</span>
                  <span className="font-medium">{formData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-light">Privacy:</span>
                  <span className="font-medium">{formData.isPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={prevStep} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 btn-premium">
                Create Meetup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMeetup;