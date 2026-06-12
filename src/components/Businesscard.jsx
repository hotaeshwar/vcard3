import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BusinessCard = () => {
  // Public folder image path
  const publicImagePath = '/media/amrita.png';

  const [formData, setFormData] = useState({
    name: 'Ar. Amrita Sachdeva',
    title: 'Architect and Interior Designer',
    phone: '9779433175',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=de%27Vine+sTudiO+Zirakpur+Chandigarh+Citi+Center',
    photo: publicImagePath, // Use public folder path directly
    facebook: '',
    instagram: '',
    whatsapp: '9779433175',
    gmbProfile: '',
    email: 'devinestudio56@gmail.com',
    website: 'www.devinestudio.com',
    address: 'SOHO 926 Block D&E, Chandigarh Citi Center Office, VIP Road, Zirakpur, Punjab 140603',
    socialMedia: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
      whatsapp: ''
    }
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tempFormData, setTempFormData] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const qrCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80';

  // Navy and Gold color scheme
  const colors = {
    primary: '#FFD300',        // Brand Yellow / Gold
    primaryLight: '#FFE97F',   // Light Gold
    primaryDark: '#CCA600',    // Dark Gold
    navy: '#111C24',           // Deep Navy Blue
    navyLight: '#1A2A36',      // Medium Navy Blue
    navyDark: '#0A1116',       // Very Dark Navy Blue
    background: '#0A1116',
    text: '#ffffff',
    textMuted: '#9ca3af',
    cardBackground: '#111C24',
    border: '#1A2A36',
    accent: '#1A2A36'
  };

  // SVG Icons as components
  const PhoneIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const MapIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  const FacebookIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );

  const InstagramIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const WhatsAppIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );

  const BusinessIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );

  const ShareIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/>
      <line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );

  const EditIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const SaveIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );

  const MailIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );

  const GlobeIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );

  const CopyIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );

  const CloseIcon = ({ size = 20, color = "#ffffff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  // Simplified image handler for public folder
  const getImageSource = (imageData) => {
    if (!imageData) {
      return publicImagePath;
    }
    
    // If it's a data URL or external URL, use it directly
    if (typeof imageData === 'string') {
      if (imageData.startsWith('data:') || imageData.startsWith('http')) {
        return imageData;
      }
      
      // If it's the public folder path or any other path, use public folder image
      return publicImagePath;
    }
    
    // For any other case, use public folder image
    return publicImagePath;
  };

  // Phone number sanitization function
  const sanitizePhone = (phone) => {
    if (!phone) return '';
    
    // Replace fancy Unicode digits with regular ASCII digits
    const unicodeMap = {
      '𝟬': '0', '𝟭': '1', '𝟮': '2', '𝟯': '3', '𝟰': '4',
      '𝟱': '5', '𝟲': '6', '𝟳': '7', '𝟴': '8', '𝟵': '9',
      '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
      '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
    };
    
    let cleaned = phone;
    Object.keys(unicodeMap).forEach(fancy => {
      cleaned = cleaned.split(fancy).join(unicodeMap[fancy]);
    });
    
    // Remove all non-digit characters except + and -
    cleaned = cleaned.replace(/[^\d+\-]/g, '');
    
    return cleaned;
  };

  // Generate vCard data for QR code / contact download
  const generateVCardData = (base64Photo = null) => {
    const cleanPhone = sanitizePhone(formData.phone);
    const cleanWhatsApp = sanitizePhone(formData.whatsapp);
    const cleanName = formData.name ? formData.name.trim() : '';
    const nameParts = cleanName.split(' ');
    const lastName = nameParts[nameParts.length - 1] || '';
    const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0] || '';
    
    const cleanEmail = formData.email ? formData.email.trim() : '';
    const cleanWebsite = formData.website ? formData.website.trim() : '';
    const cleanAddress = formData.address ? formData.address.trim().replace(/\n/g, ' ') : '';
    
    let photoLine = '';
    if (base64Photo && base64Photo.startsWith('data:image')) {
      const base64Parts = base64Photo.split(',');
      if (base64Parts.length > 1) {
        photoLine = `PHOTO;ENCODING=b;TYPE=JPEG:${base64Parts[1]}\n`;
      }
    }
    
    // Build vCard with proper formatting
    const vCardData = 
      'BEGIN:VCARD\n' +
      'VERSION:3.0\n' +
      `FN:${cleanName}\n` +
      `N:${lastName};${firstName};;;\n` +
      (formData.title ? `TITLE:${formData.title}\n` : '') +
      (cleanPhone ? `TEL;TYPE=CELL:${cleanPhone}\n` : '') +
      (formData.mapLink ? `URL:${formData.mapLink}\n` : '') +
      (formData.facebook ? `URL;TYPE=Facebook:${formData.facebook}\n` : '') +
      (formData.instagram ? `URL;TYPE=Instagram:${formData.instagram}\n` : '') +
      (cleanWhatsApp ? `TEL;TYPE=WhatsApp:${cleanWhatsApp}\n` : '') +
      (formData.gmbProfile ? `URL;TYPE=GoogleBusiness:${formData.gmbProfile}\n` : '') +
      (cleanEmail ? `EMAIL;TYPE=PREF,INTERNET:${cleanEmail}\n` : '') +
      (cleanWebsite ? `URL;TYPE=Website:https://${cleanWebsite.replace(/https?:\/\//i, '')}\n` : '') +
      (cleanAddress ? `ADR;TYPE=WORK:;;${cleanAddress};;;;\n` : '') +
      photoLine +
      'END:VCARD';

    return vCardData;
  };

  // Generate QR code for main card
  const generateQRCode = () => {
    if (!qrCanvasRef.current || !window.QRious) return;
    
    try {
      const vCardData = generateVCardData();
      
      new window.QRious({
        element: qrCanvasRef.current,
        value: vCardData,
        size: 300,
        background: 'white',
        foreground: colors.navy,
        level: 'M'
      });
    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  };

  // Load QRious script and generate QR code
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    script.onload = () => generateQRCode();
    script.onerror = () => console.error('Failed to load QRious script');
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Regenerate QR code when formData changes
  useEffect(() => {
    if (window.QRious) {
      generateQRCode();
    }
  }, [formData, colors.navy]);

  // Load data from Firebase on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, 'businessCards', 'amritaSachdeva');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(data);
          showNotification('Data loaded successfully!', 'success');
        } else {
          // Save initial data if document doesn't exist
          await setDoc(docRef, formData);
          showNotification('Initial data saved!', 'success');
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Error loading data', 'error');
      }
    };

    loadData();
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openEditModal = () => {
    setTempFormData({...formData});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setTempFormData({});
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      // Save full data including photo to Firebase
      const docRef = doc(db, 'businessCards', 'amritaSachdeva');
      await setDoc(docRef, tempFormData);
      
      // Update local state
      setFormData(tempFormData);
      closeEditModal();
      showNotification('Profile updated and saved to cloud!', 'success');
    } catch (error) {
      console.error('Error saving data:', error);
      showNotification('Error saving data to cloud', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTempFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 jpeg with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
      };
      img.onerror = () => {
        // Fallback to original base64 if image load fails
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      compressImage(file, (compressedBase64) => {
        setTempFormData(prev => ({
          ...prev,
          photo: compressedBase64
        }));
      });
    }
  };

  // Improved image error handler
  const handleImageError = (e) => {
    e.target.src = fallbackImage;
    setImageError(true);
  };

  // Function to convert image to base64 for the interactive card
  const getImageBase64 = async (imageSource) => {
    try {
      // If it's already a data URL, return it directly
      if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        return imageSource;
      }
      
      // If it's the public folder path, construct full URL
      if (typeof imageSource === 'string' && imageSource.startsWith('/')) {
        const fullUrl = window.location.origin + imageSource;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      
      // If it's an external URL, fetch and convert
      if (typeof imageSource === 'string' && imageSource.startsWith('http')) {
        const response = await fetch(imageSource);
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
      // For all other cases, use fallback
      return fallbackImage;
      
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return fallbackImage;
    }
  };

  // Download contact card (.vcf)
  const saveContact = async () => {
    try {
      showNotification('Preparing contact card...', 'info');
      
      const currentPhoto = getImageSource(formData.photo);
      let base64Photo = null;
      try {
        base64Photo = await getImageBase64(currentPhoto);
      } catch (imgErr) {
        console.error('Failed to get base64 image, downloading VCF without photo:', imgErr);
      }

      const vCardData = generateVCardData(base64Photo);
      const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.name.replace(/\s+/g, '_')}_Contact.vcf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification('Contact downloaded!', 'success');
    } catch (error) {
      console.error('Error saving contact:', error);
      showNotification('Error downloading contact card', 'error');
    }
  };

  // Share the contact file (.vcf) directly (ideal for WhatsApp contact badges)
  const shareVCF = async () => {
    try {
      showNotification('Preparing contact card...', 'info');
      
      const currentPhoto = getImageSource(formData.photo);
      let base64Photo = null;
      try {
        base64Photo = await getImageBase64(currentPhoto);
      } catch (imgErr) {
        console.error('Failed to get base64 image for share:', imgErr);
      }

      const vCardData = generateVCardData(base64Photo);
      const file = new File([vCardData], `${formData.name.replace(/\s+/g, '_')}.vcf`, { type: 'text/vcard' });
      
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${formData.name} Contact`,
          text: `Here is the contact card of ${formData.name}.`
        });
        showNotification('Contact shared successfully!', 'success');
      } else {
        // Fallback: download
        saveContact();
        showNotification('Sharing files not supported. Downloading contact file instead.', 'info');
      }
    } catch (error) {
      console.error('Error sharing contact card:', error);
      // Fallback: download
      saveContact();
    }
  };

  // Share the website link
  const shareLink = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${formData.name} - Digital Business Card`,
          text: `Check out ${formData.name}'s digital business card!`,
          url: shareUrl
        });
        showNotification('Link shared successfully!', 'success');
      } catch (err) {
        console.log('Error sharing link:', err);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  // Pre-filled WhatsApp message sharing the website link
  const shareToWhatsApp = () => {
    const shareText = encodeURIComponent(`Hi! Here is the digital business card for ${formData.name}. Tap the link to view: ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  // Copy card link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy link:', err);
      showNotification('Could not copy link. Please copy manually.', 'error');
    }
  };

  const createInteractiveCard = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      showNotification('Creating interactive business card...', 'success');

      // Get the current photo source
      const currentPhoto = getImageSource(formData.photo);
      
      // Convert image to base64
      const photoBase64 = await getImageBase64(currentPhoto);

      // Generate vCard data for the interactive card
      const vCardData = generateVCardData();

      const cardHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.name} - Business Card</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .business-card {
      background: #111C24;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(26, 42, 54, 0.5);
      overflow: hidden;
      width: 100%;
      max-width: 340px;
    }
    .header {
      background: transparent;
      padding: 30px 20px;
      text-align: center;
    }
    .photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 0 auto 15px;
      border: 4px solid #FFD300;
      object-fit: cover;
      display: block;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
    .name {
      font-size: 24px;
      font-weight: bold;
      color: #FFD300;
      margin-bottom: 5px;
    }
    .title {
      color: #EFEFEF;
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 25px 20px;
      background: transparent;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #1A2A36;
      border: 1px solid rgba(26, 42, 54, 0.6);
      border-radius: 12px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
    }
    .contact-item:last-child { margin-bottom: 0; }
    .contact-item:hover {
      background-color: rgba(26, 42, 54, 0.9);
      transform: translateY(-2px);
    }
    .icon {
      background: #0A1116;
      border: 1px solid #FFD300;
      color: #FFD300;
      padding: 10px;
      border-radius: 50%;
      min-width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .contact-info {
      flex: 1;
    }
    .contact-label {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .contact-value {
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
    }
    .contact-value:hover { color: #FFD300; }
    .qr-section {
      background: transparent;
      padding: 25px 20px;
      text-align: center;
    }
    .qr-title {
      font-size: 16px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .qr-container {
      background: white;
      padding: 20px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 20px;
      width: 100%;
      max-width: 280px;
    }
    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 20px;
    }
    .btn {
      background: #FFD300;
      color: #111C24;
      border: none;
      padding: 12px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 211, 0, 0.4);
      background: #CCA600;
    }
    .btn-full {
      grid-column: span 2;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #FFD300;
      background: transparent;
      border-top: 2px solid #FFD300;
      font-weight: bold;
    }
    @media (max-width: 480px) {
      .business-card { max-width: 310px; }
      .content { padding: 20px 15px; }
    }
  </style>
</head>
<body>
  <div class="business-card">
    <div class="header">
      <img src="${photoBase64}" alt="${formData.name}" class="photo" onerror="this.src='${fallbackImage}'">
      <div class="name">${formData.name}</div>
      ${formData.title ? `<div class="title">${formData.title}</div>` : ''}
    </div>
    
    ${(formData.phone || formData.mapLink || formData.facebook || formData.instagram || formData.whatsapp || formData.gmbProfile) ? `
    <div class="content">
      ${formData.phone ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">Phone</div>
          <a href="tel:${formData.phone}" class="contact-value">${formData.phone}</a>
        </div>
      </div>
      ` : ''}
      
      ${formData.mapLink ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">Location</div>
          <a href="${formData.mapLink}" target="_blank" class="contact-value">View on Google Maps</a>
        </div>
      </div>
      ` : ''}
      
      ${formData.facebook ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">Facebook</div>
          <a href="${formData.facebook}" target="_blank" class="contact-value">Visit Facebook</a>
        </div>
      </div>
      ` : ''}
      
      ${formData.instagram ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">Instagram</div>
          <a href="${formData.instagram}" target="_blank" class="contact-value">Visit Instagram</a>
        </div>
      </div>
      ` : ''}
      
      ${formData.whatsapp ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">WhatsApp</div>
          <a href="https://wa.me/${formData.whatsapp}" target="_blank" class="contact-value">Chat on WhatsApp</a>
        </div>
      </div>
      ` : ''}
      
      ${formData.gmbProfile ? `
      <div class="contact-item">
        <div class="icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div class="contact-info">
          <div class="contact-label">Google Business</div>
          <a href="${formData.gmbProfile}" target="_blank" class="contact-value">View Profile</a>
        </div>
      </div>
      ` : ''}
    </div>
    ` : ''}
    
    <div class="qr-section">
      <div class="qr-title">Scan to Save Contact</div>
      <div class="qr-container">
        <canvas id="qr-code" width="200" height="200" style="display: block; margin: 0 auto;"></canvas>
      </div>
      
      <div class="action-buttons">
        <button class="btn" onclick="saveContact()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Save Contact
        </button>
        ${formData.phone ? `
        <a href="tel:${formData.phone}" class="btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Call Now
        </a>
        ` : ''}
        ${formData.website ? `
        <a href="https://${formData.website.replace(/https?:\/\//i, '')}" target="_blank" class="btn btn-full">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Visit Website
        </a>
        ` : ''}
      </div>
    </div>
    
    <div class="footer">
      de'Vine sTudiO
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', function() {
      if (window.QRious) {
        const vCardData = \`${vCardData}\`;
        new QRious({
          element: document.getElementById('qr-code'),
          value: vCardData,
          size: 200,
          background: 'white',
          foreground: '#111C24',
          level: 'M'
        });
      }
    });
    
    function saveContact() {
      const vCardData = \`${vCardData}\`;
      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '${formData.name.replace(/\s+/g, '_')}_Contact.vcf';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

      if (navigator.share) {
        try {
          const blob = new Blob([cardHTML], { type: 'text/html' });
          const file = new File([blob], `${formData.name.replace(/\s+/g, '-')}-card.html`, { type: 'text/html' });
          
          await navigator.share({
            title: `${formData.name} - Business Card`,
            files: [file]
          });
          showNotification('Business card shared successfully!', 'success');
          return;
        } catch (shareError) {
          console.log('Native share failed, opening card directly');
        }
      }

      const blob = new Blob([cardHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      showNotification('Interactive business card opened!', 'success');

    } catch (err) {
      console.error('Error creating business card:', err);
      showNotification('Error creating business card', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold shadow-lg transition-all duration-300 transform translate-x-0 text-sm sm:text-base ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 
          notification.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-brand-yellow text-brand-navy'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto border border-brand-navy/10">
            <div className="bg-brand-navy px-4 sm:px-6 py-4 rounded-t-2xl border-b-4 border-brand-yellow">
              <h2 className="text-lg sm:text-xl font-bold text-brand-yellow tracking-wide">Edit Profile</h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              {/* Photo Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={getImageSource(tempFormData.photo)} 
                    alt="Profile" 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto border-4 border-brand-yellow object-cover shadow-md"
                    onError={handleImageError}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-brand-navy text-brand-yellow p-1.5 sm:p-2 rounded-full shadow-lg hover:bg-brand-yellow hover:text-brand-navy transition-all duration-200 cursor-pointer"
                  >
                    <EditIcon size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Click camera icon to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Name</label>
                  <input
                    type="text"
                    value={tempFormData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Title</label>
                  <input
                    type="text"
                    value={tempFormData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="e.g., Architect and Interior Designer"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Phone</label>
                  <input
                    type="text"
                    value={tempFormData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Email</label>
                  <input
                    type="email"
                    value={tempFormData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="devinestudio56@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Website</label>
                  <input
                    type="text"
                    value={tempFormData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="www.devinestudio.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Address</label>
                  <textarea
                    rows="2"
                    value={tempFormData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none resize-none"
                    placeholder="Enter office address"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Map Link</label>
                  <input
                    type="text"
                    value={tempFormData.mapLink || ''}
                    onChange={(e) => handleInputChange('mapLink', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="Google Maps link"
                  />
                </div>

                {/* New Social Media Fields */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={tempFormData.facebook || ''}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={tempFormData.instagram || ''}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={tempFormData.whatsapp || ''}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="Enter WhatsApp number"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-brand-navy mb-1">Google Business Profile</label>
                  <input
                    type="text"
                    value={tempFormData.gmbProfile || ''}
                    onChange={(e) => handleInputChange('gmbProfile', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow focus:outline-none"
                    placeholder="https://g.page/yourbusiness"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-4">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-brand-navy/30 text-brand-navy rounded-lg hover:bg-brand-navy/5 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-brand-yellow text-brand-navy font-bold rounded-lg hover:bg-brand-yellow-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <SaveIcon size={14} className="sm:w-4 sm:h-4" />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-brand-navy rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm border border-brand-yellow/30 overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="bg-brand-navy-dark px-4 sm:px-6 py-4 border-b-2 border-brand-yellow flex justify-between items-center">
              <h2 className="text-base sm:text-lg font-extrabold text-brand-yellow tracking-wide">Share Contact</h2>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="text-gray-400 hover:text-brand-yellow transition-colors duration-200 cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            
            {/* Options list */}
            <div className="p-4 sm:p-6 space-y-3">
              {/* WhatsApp direct share */}
              <button
                onClick={() => { shareToWhatsApp(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 text-white font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-brand-yellow hover:text-brand-navy group"
              >
                <div className="bg-brand-navy-dark p-2 rounded-full border border-brand-yellow flex items-center justify-center group-hover:bg-brand-navy">
                  <WhatsAppIcon size={18} color="#FFD300" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Share on WhatsApp</div>
                  <div className="text-xs text-gray-400 font-normal group-hover:text-brand-navy/80">Send website link to WhatsApp chat</div>
                </div>
              </button>

              {/* Share VCF file directly */}
              <button
                onClick={() => { shareVCF(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 text-white font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-brand-yellow hover:text-brand-navy group"
              >
                <div className="bg-brand-navy-dark p-2 rounded-full border border-brand-yellow flex items-center justify-center group-hover:bg-brand-navy">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD300" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Share Contact File (.vcf)</div>
                  <div className="text-xs text-gray-400 font-normal group-hover:text-brand-navy/80">Send native contact card (one-tap save)</div>
                </div>
              </button>

              {/* Share Link (native browser share) */}
              <button
                onClick={() => { shareLink(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 text-white font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-brand-yellow hover:text-brand-navy group"
              >
                <div className="bg-brand-navy-dark p-2 rounded-full border border-brand-yellow flex items-center justify-center group-hover:bg-brand-navy">
                  <ShareIcon size={18} color="#FFD300" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Share Card Link</div>
                  <div className="text-xs text-gray-400 font-normal group-hover:text-brand-navy/80">Share using system share tray</div>
                </div>
              </button>

              {/* Copy Link to Clipboard */}
              <button
                onClick={() => { copyToClipboard(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 text-white font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-brand-yellow hover:text-brand-navy group"
              >
                <div className="bg-brand-navy-dark p-2 rounded-full border border-brand-yellow flex items-center justify-center group-hover:bg-brand-navy">
                  <CopyIcon size={18} color="#FFD300" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Copy Link</div>
                  <div className="text-xs text-gray-400 font-normal group-hover:text-brand-navy/80">Copy profile link to clipboard</div>
                </div>
              </button>

              {/* Download Contact Card file */}
              <button
                onClick={() => { saveContact(); setIsShareModalOpen(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 text-white font-bold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-brand-yellow hover:text-brand-navy group"
              >
                <div className="bg-brand-navy-dark p-2 rounded-full border border-brand-yellow flex items-center justify-center group-hover:bg-brand-navy">
                  <SaveIcon size={18} color="#FFD300" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Download VCF Card</div>
                  <div className="text-xs text-gray-400 font-normal group-hover:text-brand-navy/80">Download contact file directly</div>
                </div>
              </button>
            </div>
            
            {/* Footer */}
            <div className="bg-brand-navy-dark p-3 text-center border-t border-brand-navy-light/40">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-6 py-2 text-xs sm:text-sm bg-brand-navy-light text-gray-300 font-bold rounded-lg border border-brand-navy-light/60 hover:bg-brand-navy transition-colors duration-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Container */}
      <div className="w-full max-w-[340px] mx-auto animate-fade-in">
        <div className="bg-brand-navy shadow-2xl rounded-2xl border border-brand-navy-light/40 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-transparent text-center relative">
            <div className="h-4 bg-brand-yellow w-full"></div>
            <div className="px-4 py-6 sm:py-8">
              <div className="mb-4 sm:mb-6">
                <img 
                  src={getImageSource(formData.photo)} 
                  alt={formData.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full mx-auto border-4 border-brand-yellow shadow-lg object-cover"
                  onError={handleImageError}
                />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-yellow mb-2 tracking-wide drop-shadow-xs">
                {formData.name}
              </h1>
              {formData.title && (
                <p className="text-xs sm:text-sm md:text-base text-gray-300 opacity-90 tracking-wider font-semibold uppercase">
                  {formData.title}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          {(formData.phone || formData.mapLink || formData.facebook || 
            formData.instagram || formData.whatsapp || formData.gmbProfile || 
            formData.email || formData.website || formData.address) && (
            <div className="px-4 sm:px-6 py-4 sm:py-6 bg-transparent">
              <div className="space-y-3 sm:space-y-4">
                
                {/* Address - Only show if address exists */}
                {formData.address && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <MapIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Address
                      </div>
                      <a 
                        href={formData.mapLink || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        {formData.address}
                      </a>
                    </div>
                  </div>
                )}

                {/* Phone - Only show if phone exists */}
                {formData.phone && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <PhoneIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Phone
                      </div>
                      <a 
                        href={`tel:${formData.phone}`} 
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        {formData.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email - Only show if email exists */}
                {formData.email && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <MailIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Email
                      </div>
                      <a 
                        href={`mailto:${formData.email}`} 
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        {formData.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website - Only show if website exists */}
                {formData.website && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <GlobeIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Website
                      </div>
                      <a 
                        href={`https://${formData.website.replace(/https?:\/\//i, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        {formData.website}
                      </a>
                    </div>
                  </div>
                )}

                {/* Facebook - Only show if exists */}
                {formData.facebook && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <FacebookIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Facebook
                      </div>
                      <a 
                        href={formData.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        Visit Profile
                      </a>
                    </div>
                  </div>
                )}

                {/* Instagram - Only show if exists */}
                {formData.instagram && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <InstagramIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Instagram
                      </div>
                      <a 
                        href={formData.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        Visit Profile
                      </a>
                    </div>
                  </div>
                )}

                {/* WhatsApp - Only show if exists */}
                {formData.whatsapp && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <WhatsAppIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        WhatsApp
                      </div>
                      <a 
                        href={`https://wa.me/${formData.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Google Business Profile - Only show if exists */}
                {formData.gmbProfile && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-brand-navy-light border border-brand-navy-light/60 transition-all duration-200 hover:shadow-md hover:bg-brand-navy-light/90">
                    <div className="bg-brand-navy-dark p-2 sm:p-3 rounded-full border border-brand-yellow flex items-center justify-center flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 shadow-sm">
                      <BusinessIcon size={20} color="#FFD300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                        Google Business
                      </div>
                      <a 
                        href={formData.gmbProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-white font-bold no-underline hover:text-brand-yellow transition-colors duration-200 block truncate"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Code Section */}
          <div className="bg-transparent px-4 sm:px-6 py-6 sm:py-8 text-center">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">
              Scan to Save Contact
            </h3>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-brand-navy-light inline-block mb-4 sm:mb-6 w-full max-w-[200px] sm:max-w-[240px]">
              <canvas 
                ref={qrCanvasRef}
                className="w-32 h-32 sm:w-48 sm:h-48 mx-auto block"
                style={{ display: 'block' }}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button 
                onClick={saveContact}
                className="w-full bg-brand-yellow text-brand-navy border-none px-4 py-3 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:bg-brand-yellow-dark transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Save Contact
              </button>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button 
                  onClick={openEditModal}
                  className="bg-brand-navy-light text-white border border-brand-navy-light/60 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md hover:bg-brand-navy"
                >
                  <EditIcon size={14} className="sm:w-4 sm:h-4" color="#ffffff" />
                  Edit Card
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="bg-brand-navy-light text-white border border-brand-navy-light/60 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md hover:bg-brand-navy"
                >
                  <ShareIcon size={14} className="sm:w-4 sm:h-4" color="#ffffff" />
                  Share Card
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-transparent px-4 sm:px-6 py-3 sm:py-4 text-center border-t-2 border-brand-yellow">
            <div className="text-brand-yellow font-extrabold text-base sm:text-lg md:text-xl tracking-wider">
              de'Vine sTudiO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
