import React, { useState } from 'react';
import { useSpending } from '../context/SpendingContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const Profile = () => {
    const { user, updateProfile, loading } = useAuth();
    const { allowance, setAllowance, fixedExpenses, setFixedExpenses, weekendBias, setWeekendBias } = useSpending();

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);

    // User Details State
    const [tempName, setTempName] = useState(user?.name || '');
    const [tempEmail, setTempEmail] = useState(user?.email || '');
    const [tempPhone, setTempPhone] = useState(user?.phone || '');
    const [tempPhoto, setTempPhoto] = useState(user?.photoURL || null);

    // Financial State
    const [tempAllowance, setTempAllowance] = useState(allowance);
    const [tempFixed, setTempFixed] = useState(fixedExpenses);
    const [tempBias, setTempBias] = useState(weekendBias);

    // File Input Ref
    const fileInputRef = React.useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        // Save Context Data
        setAllowance(Number(tempAllowance));
        setFixedExpenses(Number(tempFixed));
        setWeekendBias(tempBias);

        // Save User Data via AuthContext
        await updateProfile({
            name: tempName,
            email: tempEmail,
            phone: tempPhone,
            photoURL: tempPhoto
        });

        setIsEditing(false);
    };

    return (
        <div className="container mx-auto max-w-2xl px-6 pt-8 pb-24">
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Button variant="ghost" onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={loading}>
                    {loading ? <i className="fi fi-rr-spinner animate-spin text-xl"></i> : isEditing ? <i className="fi fi-rr-disk text-xl text-primary"></i> : <i className="fi fi-rr-edit text-xl"></i>}
                    <span className="ml-2">{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit'}</span>
                </Button>
            </header>

            <div className="flex items-center gap-4 mb-10">
                <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-white shadow-xl shrink-0 overflow-hidden border-2 border-transparent group-hover:border-primary/50 transition-colors">
                        {(isEditing ? tempPhoto : user?.photoURL) ? (
                            <img
                                src={isEditing ? tempPhoto : user?.photoURL}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.name?.[0] || 'U'
                        )}
                    </div>

                    {/* Camera Overlay for Edit Mode */}
                    {isEditing && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <i className="fi fi-rr-camera text-2xl text-white"></i>
                            </button>
                        </>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    {isEditing ? (
                        <>
                            <Input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                className="h-10 text-lg font-semibold bg-secondary/50"
                                placeholder="Your Name"
                            />
                            <Input
                                value={tempEmail}
                                onChange={(e) => setTempEmail(e.target.value)}
                                className="h-9 text-sm text-muted-foreground bg-secondary/50"
                                placeholder="Email Address"
                            />
                            <Input
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                className="h-9 text-sm text-muted-foreground bg-secondary/50"
                                placeholder="Phone Number"
                            />
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                            <p className="text-muted-foreground text-sm">{user?.email}</p>
                            {user?.phone && <p className="text-muted-foreground text-xs flex items-center gap-1"><i className="fi fi-rr-phone-call"></i>{user.phone}</p>}
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <i className="fi fi-rr-credit-card text-xl text-blue-400"></i>
                        <h3 className="font-semibold text-lg">Financial Settings</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm text-muted-foreground">Monthly Allowance</label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={tempAllowance}
                                    onChange={e => setTempAllowance(e.target.value)}
                                    className="h-10"
                                />
                            ) : (
                                <div className="font-mono text-right">₹{allowance}</div>
                            )}
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm text-muted-foreground">Fixed Expenses</label>
                            {isEditing ? (
                                <Input
                                    type="number"
                                    value={tempFixed}
                                    onChange={e => setTempFixed(e.target.value)}
                                    className="h-10"
                                />
                            ) : (
                                <div className="font-mono text-right">₹{fixedExpenses}</div>
                            )}
                        </div>
                        <div className="h-px bg-white/5" />
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <label className="text-sm text-muted-foreground">Weekend Strategy</label>
                            {isEditing ? (
                                <select
                                    value={tempBias}
                                    onChange={e => setTempBias(e.target.value)}
                                    className="h-10 bg-secondary rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                                >
                                    <option value="strict">Strict (Equal)</option>
                                    <option value="balanced">Balanced (10%)</option>
                                    <option value="flexible">Party (20%)</option>
                                </select>
                            ) : (
                                <div className="text-right capitalize text-primary">{weekendBias}</div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-secondary/20 border-none">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fi fi-rr-shield-check text-xl text-green-400"></i>
                        <h3 className="font-semibold text-lg">Spending DNA</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You are a <span className="text-foreground font-medium">Balanced Saver</span>. You tend to be disciplined during the week but sometimes splurge on weekends. LIM AI is helping you smooth out those spikes.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
