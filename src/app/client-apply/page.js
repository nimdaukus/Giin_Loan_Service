'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowLeft, ArrowRight, ShieldCheck, Loader2, Camera, Upload, Trash2 } from 'lucide-react';

export default function ClientApply() {
  const router = useRouter();
  const { currentUser, submitApplication } = useApp();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+250');
  const [passport, setPassport] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('1-week');
  const [type, setType] = useState('Business Expansion Loan');
  const [isLoading, setIsLoading] = useState(false);

  // New Collateral states
  const [headshot, setHeadshot] = useState('');
  const [itemType, setItemType] = useState('Smartphone');
  const [itemModel, setItemModel] = useState('iPhone 14 Pro');
  const [itemCondition, setItemCondition] = useState('Used');
  const [itemId, setItemId] = useState('');
  const [collateralImages, setCollateralImages] = useState([]); // Base64 strings array

  // Consents states
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  // Models mapping dictionary
  const modelsMap = {
    Smartphone: ['iPhone 14 Pro', 'iPhone 13', 'Samsung Galaxy S23', 'Google Pixel 7'],
    Laptop: ['MacBook Pro M2', 'MacBook Air M1', 'Dell XPS 13', 'Lenovo ThinkPad X1'],
    Vehicle: ['Toyota RAV4', 'Honda Civic', 'Hyundai Elantra', 'Tesla Model 3'],
    'Real Estate': ['Residential Apartment', 'Commercial Office', 'Agricultural Land plot']
  };

  useEffect(() => {
    setMounted(true);
    // Clear all fields on entry
    setPhone('');
    setPassport('');
    setAddress('');
    setAmount('');
    setHeadshot('');
    setCollateralImages([]);
    setItemId('');
    setConsent1(false);
    setConsent2(false);
    setConsent3(false);
  }, []);

  // Update model when type changes
  useEffect(() => {
    if (modelsMap[itemType]) {
      setItemModel(modelsMap[itemType][0]);
    }
  }, [itemType]);

  if (!mounted) return null;

  // Authorization Guard: client-only page
  if (!currentUser || currentUser.role !== 'Client') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
        <p>This portal is restricted to client accounts.</p>
      </div>
    );
  }

  // Handle headshot upload
  const handleHeadshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeadshot(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle collateral images upload
  const handleCollateralImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (collateralImages.length + files.length > 3) {
      alert('You can only submit up to 3 collateral images.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCollateralImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCollateralImage = (indexToRemove) => {
    setCollateralImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !passport || !address || !amount) {
      alert('Please fill out all identity fields.');
      return;
    }

    if (!headshot) {
      alert('Professional Headshot is required for identity verification.');
      return;
    }

    if (collateralImages.length === 0) {
      alert('Please upload at least 1 image of the collateral.');
      return;
    }

    if (!consent1 || !consent2 || !consent3) {
      alert('You must accept all terms of consent before submitting your application.');
      return;
    }

    setIsLoading(true);

    // Build the dynamic collateral description
    const calculatedCollateralDesc = `${itemType} (Model: ${itemModel}, Condition: ${itemCondition}, ID/Serial: ${itemId || 'N/A'})`;

    const consentsChecked = [
      "I confirm that the collateral security details and uploaded headshot are accurate and represent my legal assets.",
      "I agree to the terms of the GIIN Sentinel credit policy, interest calculations, and late surcharge penalties.",
      "I authorize GIIN Sentinel to perform background verification and lock collateral assets in case of loan delinquency."
    ];

    const appData = {
      name: currentUser.name,
      email: currentUser.email,
      phone: `${countryCode} ${phone}`,
      passport,
      address,
      amount,
      term,
      type,
      collateralDesc: calculatedCollateralDesc,
      collateralImages,
      headshot,
      consents: consentsChecked
    };

    try {
      await submitApplication(appData);
      alert('Loan Application Submitted successfully! Redirecting to dashboard...');
      
      // Clear fields upon submission
      setPhone('');
      setPassport('');
      setAddress('');
      setAmount('');
      setHeadshot('');
      setCollateralImages([]);
      setItemId('');
      setConsent1(false);
      setConsent2(false);
      setConsent3(false);

      router.push('/client-dashboard');
    } catch (err) {
      alert('Error submitting application: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Back navigation */}
      <div>
        <button 
          onClick={() => router.push('/client-dashboard')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', border: 'none', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Apply for a Credit Line</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Submit legal and financial descriptors to request a dynamic credit allocation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Section 1: Professional Headshot */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            1. Professional Verification Profile
          </h3>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {headshot ? (
                <img src={headshot} alt="Headshot Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Camera size={28} color="#94a3b8" />
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', backgroundColor: '#fafafa' }}>
                <Upload size={14} /> Upload Headshot
                <input type="file" accept="image/*" onChange={handleHeadshotChange} style={{ display: 'none' }} />
              </label>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Required for facial biometrics identity audits. Max file size: 5MB.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Borrower Information */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            2. Personal Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Full Legal Name
                </label>
                <input 
                  type="text" 
                  readOnly 
                  value={currentUser.name} 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#64748b', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Registered Email
                </label>
                <input 
                  type="email" 
                  readOnly 
                  value={currentUser.email} 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: '#64748b', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Phone Number
                </label>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{ padding: '0.75rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', width: '100px', cursor: 'pointer' }}
                  >
                    <option value="+250">RW (+250)</option>
                    <option value="+1">US (+1)</option>
                    <option value="+254">KE (+254)</option>
                    <option value="+256">UG (+256)</option>
                    <option value="+234">NG (+234)</option>
                  </select>
                  <input 
                    type="tel" 
                    required
                    placeholder="788 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  National ID / Passport
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 1199580001000100"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Physical Residential Address
              </label>
              <input 
                type="text" 
                required
                placeholder="e.g. KN 12 Ave, Kigali"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Parameters */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            3. Loan Terms & Parameters
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Requested Amount (RWF)
              </label>
              <input 
                type="number" 
                required
                placeholder="e.g. 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Repayment Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
              >
                <option value="1-week">1 Week (15% Interest)</option>
                <option value="2-weeks">2 Weeks (25% Interest)</option>
                <option value="3-weeks">3 Weeks (30% Interest)</option>
                <option value="4-weeks">4 Weeks (35% Interest)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                Credit Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Business Expansion Loan">Business Expansion</option>
                <option value="Emergency Credit Node">Emergency Node</option>
                <option value="Personal Bridging Fund">Personal Bridging</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Dynamic Collateral Asset Details */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            4. Collateral Security Asset Detail
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Collateral Item Category
                </label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="Smartphone">Smartphone / Mobile device</option>
                  <option value="Laptop">Laptop / Workstation</option>
                  <option value="Vehicle">Vehicle / Automobile</option>
                  <option value="Real Estate">Real Estate Property</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Asset Model / Type
                </label>
                <select
                  value={itemModel}
                  onChange={(e) => setItemModel(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
                >
                  {(modelsMap[itemType] || []).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Condition / Status
                </label>
                <select
                  value={itemCondition}
                  onChange={(e) => setItemCondition(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="New">New / Pristine</option>
                  <option value="Used">Used / Functional</option>
                  <option value="Old">Old / Fair</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                {itemType === 'Smartphone' || itemType === 'Laptop' ? 'IMEI / Serial Number' : itemType === 'Vehicle' ? 'Registration Plate / Chassis No' : 'Parcel land ID / Location Coordinates'} (Optional)
              </label>
              <input 
                type="text" 
                placeholder={`e.g. ${itemType === 'Smartphone' ? 'IMEI 35824900...' : itemType === 'Laptop' ? 'Serial C02Y...' : itemType === 'Vehicle' ? 'RAD 123 A' : 'Parcel No 102/05...'}`}
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#fafafa', outline: 'none' }}
              />
            </div>

            {/* Collateral Images upload slot */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Collateral Photos (Required: Upload up to 3 images)
              </label>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ width: '80px', height: '80px', border: '2px dashed #cbd5e1', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fafafa' }}>
                  <Upload size={20} color="#94a3b8" />
                  <span style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: '4px' }}>Add Photo</span>
                  <input type="file" multiple accept="image/*" onChange={handleCollateralImagesChange} style={{ display: 'none' }} />
                </label>

                {collateralImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <img src={img} alt={`Collateral Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => removeCollateralImage(idx)} 
                      style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Checkboxes of Consent */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            5. Institutional Disclaimers & Consents
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} style={{ marginTop: '3px' }} />
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                I confirm that the collateral security details and uploaded headshot are accurate, complete, and represent my valid legal properties.
              </span>
            </label>

            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} style={{ marginTop: '3px' }} />
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                I agree to the terms of the GIIN Sentinel credit policy, including interest rate calculations, late fee penalties, and payment schedules.
              </span>
            </label>

            <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input type="checkbox" checked={consent3} onChange={(e) => setConsent3(e.target.checked)} style={{ marginTop: '3px' }} />
              <span style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                I authorize GIIN Sentinel administrators to run back-end background checks, audit my security profile, and lock the described collateral assets in case of loan delinquency.
              </span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--color-primary-hover)' }}>
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <span>
            Checking these consents provides authentication signatures that verify this request with the Institutional Admin node.
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary pulse-glow-btn"
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Processing Application...
            </>
          ) : (
            <>
              Submit Loan Application <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
