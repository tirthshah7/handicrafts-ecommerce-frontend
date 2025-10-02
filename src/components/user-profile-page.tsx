import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { useBackend } from './backend-provider';
import { toast } from 'sonner';

interface UserProfilePageProps {
  onBackToHome: () => void;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export function UserProfilePage({ onBackToHome }: UserProfilePageProps) {
  const { user, isAuthenticated, signOut } = useBackend();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefault: false
  });

  // Sample addresses (in a real app, this would come from the backend)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '+91 9876543210',
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      country: 'India',
      isDefault: false
    }
  ]);

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleProfileSave = () => {
    // In a real app, this would update the user profile via API
    toast.success('Profile updated successfully!');
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  };

  const handleAddressEdit = (address: Address) => {
    setEditingAddressId(address.id);
    setIsEditingAddress(true);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault
    });
  };

  const handleAddressSave = () => {
    if (editingAddressId) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddressId 
          ? { ...addr, ...addressForm }
          : addr
      ));
      toast.success('Address updated successfully!');
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...addressForm
      };
      setAddresses(prev => [...prev, newAddress]);
      toast.success('Address added successfully!');
    }
    
    setIsEditingAddress(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    resetAddressForm();
  };

  const handleAddressCancel = () => {
    setIsEditingAddress(false);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    resetAddressForm();
  };

  const handleAddAddress = () => {
    setIsAddingAddress(true);
    setIsEditingAddress(true);
    resetAddressForm();
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    toast.success('Address deleted successfully!');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast.success('Default address updated!');
  };

  const resetAddressForm = () => {
    setAddressForm({
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isDefault: false
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your profile and manage your account.
            </p>
            <Button onClick={onBackToHome}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackToHome}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and addresses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                {!isEditingProfile && (
                  <Button variant="outline" size="sm" onClick={handleProfileEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingProfile ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleProfileSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleProfileCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user?.name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
                {!isEditingAddress && (
                  <Button variant="outline" size="sm" onClick={handleAddAddress}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingAddress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address-name">Name</Label>
                      <Input
                        id="address-name"
                        value={addressForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address-phone">Phone</Label>
                      <Input
                        id="address-phone"
                        value={addressForm.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-street">Street Address</Label>
                    <Textarea
                      id="address-street"
                      value={addressForm.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                      placeholder="Enter street address"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address-city">City</Label>
                      <Input
                        id="address-city"
                        value={addressForm.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address-state">State</Label>
                      <Input
                        id="address-state"
                        value={addressForm.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address-pincode">Pincode</Label>
                      <Input
                        id="address-pincode"
                        value={addressForm.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address-country">Country</Label>
                    <Select
                      value={addressForm.country}
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={addressForm.isDefault}
                      onChange={(e) => handleInputChange('isDefault', e.target.checked.toString())}
                      className="rounded"
                    />
                    <Label htmlFor="isDefault">Set as default address</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddressSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Address
                    </Button>
                    <Button variant="outline" onClick={handleAddressCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                      <Button onClick={handleAddAddress}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <motion.div
                        key={address.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{address.name}</h4>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{address.phone}</p>
                            <p className="text-sm mt-1">
                              {address.street}, {address.city}, {address.state} - {address.pincode}, {address.country}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddressEdit(address)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
              <Button variant="destructive" onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  toast.info('Account deletion feature coming soon!');
                }
              }}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
