// hooks/useUserIP.js
import { useState, useEffect } from 'react';

const useUserIP = (options = {}) => {
  const { 
    autoFetch = true,
    fallbackAPIs = true,
    timeout = 5000 
  } = options;

  const [ipData, setIpData] = useState({
    ip: '',
    country: '',
    countryCode: '',
    city: '',
    region: '',
    isp: '',
    loading: false,
    error: null
  });

  const fetchIP = async () => {
    setIpData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // لیست APIهای پشتیبان
      const apiEndpoints = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://jsonip.com'
      ];

      let ipResponse = null;
      
      // امتحان کردن APIها به ترتیب
      for (const endpoint of apiEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const response = await fetch(endpoint, { 
            signal: controller.signal 
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            ipResponse = await response.json();
            break;
          }
        } catch (err) {
          console.log(`API ${endpoint} failed:`, err.message);
          continue;
        }
      }

      if (!ipResponse) {
        throw new Error('All IP APIs failed');
      }

      // استخراج IP از پاسخ‌های مختلف
      const ip = ipResponse.ip || ipResponse.query;

      // گرفتن اطلاعات جغرافیایی بر اساس IP
      try {
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoResponse.json();

        setIpData({
          ip,
          country: geoData.country_name,
          countryCode: geoData.country_code,
          city: geoData.city,
          region: geoData.region,
          isp: geoData.org,
          loading: false,
          error: null
        });
      } catch (geoError) {
        // اگر اطلاعات جغرافیایی失败 شد، فقط IP را ذخیره می‌کنیم
        setIpData({
          ip,
          country: '',
          countryCode: '',
          city: '',
          region: '',
          isp: '',
          loading: false,
          error: null
        });
      }

    } catch (error) {
      setIpData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchIP();
    }
  }, [autoFetch]);

  // تابع برای دریافت پرچم کشور
  const getFlagEmoji = () => {
    if (!ipData.countryCode) return '🏴';
    
    return ipData.countryCode
      .toUpperCase()
      .replace(/./g, char => 
        String.fromCodePoint(127397 + char.charCodeAt())
      );
  };

  // تابع برای دریافت موقعیت به صورت خلاصه
  const getLocationString = () => {
    if (ipData.city && ipData.country) {
      return `${ipData.city}, ${ipData.country}`;
    }
    return ipData.country || 'Unknown location';
  };

  return {
    // داده‌ها
    ip: ipData.ip,
    country: ipData.country,
    countryCode: ipData.countryCode,
    city: ipData.city,
    region: ipData.region,
    isp: ipData.isp,
    
    // وضعیت
    loading: ipData.loading,
    error: ipData.error,
    
    // متدها
    refetch: fetchIP,
    getFlagEmoji,
    getLocationString,
    
    // داده کامل
    data: ipData
  };
};

export default useUserIP;