import { useState } from "react";
import { useStore } from "@/lib/store";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { UserCog, MapPin, Luggage, CreditCard, Languages, Calendar, Mail } from "lucide-react";
import SideMenu from "@/components/SideMenu";

const Profile = () => {
  const { userProfile, updateUserProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [interests, setInterests] = useState<string[]>(
    userProfile?.preferences.interests || []
  );
  
  const [budget, setBudget] = useState({
    min: userProfile?.preferences.budget.min || 500,
    max: userProfile?.preferences.budget.max || 2000
  });
  
  const [duration, setDuration] = useState({
    min: userProfile?.preferences.duration.min || 3,
    max: userProfile?.preferences.duration.max || 10
  });
  
  const handleSaveProfile = () => {
    updateUserProfile({
      preferences: {
        interests,
        budget,
        duration
      }
    });
    setIsEditing(false);
  };
  
  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };
  
  const interestsList = [
    "Beach", "Culture", "Food", "Nightlife", "Adventure", "History", "Shopping", "Nature",
    "Architecture", "Art", "Relaxation", "Romantic", "Family", "Urban", "Wildlife", "Winter"
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">My Profile</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8"
                onClick={() => setIsEditing(true)}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={userProfile?.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself..." />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <UserCog className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium dark:text-white">{userProfile?.username}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                      <Mail className="h-3 w-3 mr-1" /> {userProfile?.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-neutral-500 mr-2" />
                    <span className="text-sm dark:text-neutral-300">New York, USA</span>
                  </div>
                  <div className="flex items-center">
                    <Languages className="h-4 w-4 text-neutral-500 mr-2" />
                    <span className="text-sm dark:text-neutral-300">English, Spanish</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-neutral-500 mr-2" />
                    <span className="text-sm dark:text-neutral-300">Member since 2023</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Travel Preferences</CardTitle>
          <CardDescription>Customize your travel experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2 dark:text-white">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interestsList.map(interest => (
                  <Badge 
                    key={interest} 
                    variant="outline" 
                    className={`cursor-pointer ${
                      interests.includes(interest) 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : ""
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium dark:text-white">Budget Range</h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  ${budget.min} - ${budget.max}
                </span>
              </div>
              <Slider
                value={[budget.min, budget.max]}
                min={100}
                max={5000}
                step={100}
                onValueChange={(values) => setBudget({ min: values[0], max: values[1] })}
                className="mb-6"
              />
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-neutral-500 mr-2" />
                <span className="text-xs dark:text-neutral-300">
                  Your preferred budget range for trips
                </span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium dark:text-white">Trip Duration</h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {duration.min} - {duration.max} days
                </span>
              </div>
              <Slider
                value={[duration.min, duration.max]}
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => setDuration({ min: values[0], max: values[1] })}
                className="mb-6"
              />
              <div className="flex items-center">
                <Luggage className="h-4 w-4 text-neutral-500 mr-2" />
                <span className="text-xs dark:text-neutral-300">
                  Your preferred trip length
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveProfile}
                className="w-full"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how we contact you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifs" className="flex-1">Email Notifications</Label>
              <Switch id="email-notifs" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="promo-notifs" className="flex-1">Promotional Updates</Label>
              <Switch id="promo-notifs" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-notifs" className="flex-1">App Notifications</Label>
              <Switch id="app-notifs" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <SideMenu />
    </div>
  );
};

export default Profile;