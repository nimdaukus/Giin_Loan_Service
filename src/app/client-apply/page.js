'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Landmark, ArrowLeft, ArrowRight, ShieldCheck, Loader2, Camera, Upload, Trash2, Video, FileText, CheckCircle2 } from 'lucide-react';

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

  // Profile Photos & Passport File states
  const [headshot, setHeadshot] = useState('');
  const [passportFile, setPassportFile] = useState('');
  const [passportFileName, setPassportFileName] = useState('');

  // Collateral states
  const [itemType, setItemType] = useState('Smartphone');
  const [itemModel, setItemModel] = useState('iPhone 15 Pro Max');
  const [itemCondition, setItemCondition] = useState('Used');
  const [itemId, setItemId] = useState('');
  const [collateralImages, setCollateralImages] = useState([]); // Base64 strings array

  // Camera Live Stream states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // Consents states
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);

  // Massive Curated Database of 100+ Collateral Categories & Models
  const modelsMap = {
    Smartphone: [
      'iPhone 15 Pro Max',
      'iPhone 14 Pro',
      'Samsung Galaxy S24 Ultra',
      'Samsung Galaxy Z Fold 5',
      'Google Pixel 8 Pro',
      'OnePlus 12',
      'Xiaomi 14 Ultra',
      'Huawei Mate 60 Pro',
      'Sony Xperia 1 V',
      'Asus Zenfone 10'
    ],
    Laptop: [
      'MacBook Pro M3 Max',
      'MacBook Air M2',
      'Dell XPS 15 OLED',
      'Lenovo ThinkPad X1 Carbon',
      'HP Spectre x360',
      'Asus ROG Zephyrus G14',
      'Razer Blade 16',
      'Microsoft Surface Laptop Studio 2',
      'Acer Swift Edge',
      'MSI Creator 17'
    ],
    Vehicle: [
      'Tesla Model Y Performance',
      'Toyota Land Cruiser Prado',
      'Toyota Hilux Double Cab',
      'Honda CR-V Sport Hybrid',
      'Ford Ranger Raptor',
      'BMW X5 xDrive40i',
      'Mercedes-Benz GLE 450',
      'Audi Q7 TFSI',
      'Hyundai Palisade',
      'Kia Telluride'
    ],
    'Real Estate': [
      'Residential Villa (5-Bedroom)',
      'Commercial Warehouse (5000 sq ft)',
      'Agricultural Farmland Plot (10 Hectares)',
      'Industrial Estate Block',
      'Retail Storefront (Downtown)',
      'Multi-Family Apartment Building',
      'Vacant Suburban Plot',
      'Beachfront Development Plot',
      'Office Suite (Grade A)',
      'Log Cabin Estate'
    ],
    'Agricultural Machinery': [
      'John Deere Tractor 5075E',
      'Combine Harvester S700',
      'Crop Sprayer (Self-Propelled)',
      'Grain Dryer System',
      'Heavy-Duty Irrigation Pump',
      'Farm Utility Vehicle (UTV)',
      'Disc Harrow Attachment',
      'Seed Drill Planter',
      'Hay Baler (Round)',
      'Feed Mixer Wagon'
    ],
    'Industrial Equipment': [
      'Caterpillar Excavator 320',
      'Forklift Truck (3-Ton Electric)',
      'Diesel Generator (100kVA Standby)',
      'CNC Milling Machine (5-Axis)',
      'Industrial Concrete Mixer',
      'Plastic Injection Molding Machine',
      'Air Compressor (Screw Type)',
      'Electric Arc Welder System',
      'Heavy-Duty Lathe Machine',
      'Industrial Packaging Line'
    ],
    'Mining Machinery': [
      'Gold Wash Plant (Portable)',
      'Rock Crusher (Jaw Type)',
      'Pneumatic Jackhammer',
      'Mining Dump Truck (Off-Highway)',
      'Belt Conveyor System (50m)',
      'Core Drilling Rig',
      'Mineral Shaking Table',
      'Heavy-Duty Underground Loader',
      'Diamond Wire Saw',
      'Magnetic Separator'
    ],
    'Audio-Visual Gear': [
      'RED V-Raptor 8K Cinema Camera',
      'Sony FX3 Full-Frame Camera',
      'DJI Inspire 3 Cinema Drone',
      'Stage Intelligent Light Rig',
      'Studio Monitor Speaker Pair (Genelec)',
      'Sennheiser Wireless Mic System',
      'Blackmagic ATEM Constellation Switcher',
      'LED Video Wall Panel (2.5mm Pitch)',
      'Pioneer DJ Nexus 2 Deck System',
      'Neumann U87 Ai Studio Microphone'
    ],
    'Luxury & Precious Goods': [
      'Rolex Submariner Date Watch',
      'Gold Ingot Bar (24k - 100g)',
      'Diamond Engagement Ring (2-Carat)',
      'Patek Philippe Nautilus Watch',
      'Premium Oil Barrel Certificates',
      '10-Year Government Treasury Bond',
      'Corporate Debt Bond Certificate',
      'Emerald Gemstone (3-Carat Certified)',
      'Fine Art Oil Painting (Registered)',
      'Silver Bullion Bar (1kg)'
    ],
    'Office & IT Infrastructure': [
      'Enterprise Server Rack (42U Loaded)',
      'CISCO Core Network Switch',
      'High-Speed Commercial Printer (Xerox)',
      'Office HVAC System Unit',
      'Cisco IP Phone System (20-Line)',
      'Centralized UPS Backup System (20kVA)',
      'Commercial Paper Shredder',
      'Office Coffee Station (Espresso Industrial)',
      'Smart Board Interactive Display (85")',
      'Network Attached Storage (NAS 100TB)'
    ]
  };

  useEffect(() => {
    setMounted(true);
    // Clear all fields on entry
    setPhone('');
    setPassport('');
    setAddress('');
    setAmount('');
    setHeadshot('');
    setPassportFile('');
    setPassportFileName('');
    setCollateralImages([]);
    setItemId('');
    setConsent1(false);
    setConsent2(false);
    setConsent3(false);
  }, []);

  // Update model option when type changes
  useEffect(() => {
    if (modelsMap[itemType]) {
      setItemModel(modelsMap[itemType][0]);
    }
  }, [itemType]);

  // Video stream mapping
  useEffect(() => {
    if (showCameraModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [showCameraModal, cameraStream]);

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

  // Camera Handlers
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
      setShowCameraModal(true);
    } catch (err) {
      alert('Camera access denied or unavailable: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      setHeadshot(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  // Upload Handlers
  const handleHeadshotUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setHeadshot(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePassportUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPassportFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPassportFile(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

    if (!passportFile) {
      alert('Please upload a copy of your Passport document.');
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
      consents: consentsChecked,
      passportFile
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
      setPassportFile('');
      setPassportFileName('');
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" onClick={startCamera} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                  <Video size={12} /> Take Photo (Camera)
                </button>
                <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.4rem 0.75rem', fontSize: '0.75rem', cursor: 'pointer', margin: 0 }}>
                  <Upload size={12} /> Choose from Library
                  <input type="file" accept="image/*" onChange={handleHeadshotUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Required for facial biometrics identity audits. Max file size: 5MB.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Borrower Information & Passport Document */}
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '800', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            2. Personal Details & Passport Document
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
                  National ID / Passport Number
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Physical Address
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

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Passport File Copy (PDF, PNG, JPG, JPEG)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.65rem 1rem', fontSize: '0.8rem', cursor: 'pointer', margin: 0 }}>
                    <Upload size={14} /> Upload Passport
                    <input type="file" accept=".pdf,image/*" onChange={handlePassportUpload} style={{ display: 'none' }} />
                  </label>
                  {passportFileName && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)', backgroundColor: 'var(--color-success-bg)', padding: '2px 8px', borderRadius: '4px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {passportFileName}
                    </span>
                  )}
                </div>
              </div>
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
            4. Collateral Security Asset Detail (100+ Asset Options Database)
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
                  <option value="Agricultural Machinery">Agricultural Machinery</option>
                  <option value="Industrial Equipment">Industrial Equipment</option>
                  <option value="Mining Machinery">Mining Machinery</option>
                  <option value="Audio-Visual Gear">Audio-Visual & Production Gear</option>
                  <option value="Luxury & Precious Goods">Luxury & Precious Goods</option>
                  <option value="Office & IT Infrastructure">Office & IT Infrastructure</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                  Asset Model / Type (10 Curated Model Varieties)
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

      {/* Camera Live Stream Capture Modal */}
      {showCameraModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Take Profile Photo</h3>
              <button type="button" onClick={stopCamera} style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <div style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#000000', border: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scaleX(-1)' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <button type="button" onClick={stopCamera} className="btn btn-outline" style={{ flex: 1, padding: '0.6rem' }}>
                Cancel
              </button>
              <button type="button" onClick={capturePhoto} className="btn btn-primary" style={{ flex: 1, padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <Camera size={16} /> Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
