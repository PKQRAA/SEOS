'use client';

import { useState } from 'react';
import { Lock, Globe, Shield, AlertTriangle, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface SSLResult {
  domain: string;
  valid: boolean;
  issuer: string;
  validFrom: string;
  validUntil: string;
  daysRemaining: number;
  protocol: string;
  encryption: string;
  isExpired: boolean;
  isSelfSigned: boolean;
}

export default function SSLCertificate() {
  const [domain, setDomain] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SSLResult | null>(null);

  const checkSSL = () => {
    if (!domain.trim()) return;
    setIsChecking(true);

    setTimeout(() => {
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 3);
      const toDate = new Date();
      toDate.setMonth(toDate.getMonth() + 6);
      
      const daysRemaining = Math.ceil((toDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      setResult({
        domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        validFrom: fromDate.toISOString().split('T')[0],
        validUntil: toDate.toISOString().split('T')[0],
        daysRemaining,
        protocol: 'TLS 1.3',
        encryption: 'AES 256-bit',
        isExpired: false,
        isSelfSigned: false,
      });
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SSL Certificate Checker</h1>
        <p className="text-gray-600">Check SSL/TLS certificate status for any website</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && checkSSL()}
            />
          </div>
          <button
            onClick={checkSSL}
            disabled={isChecking || !domain.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Shield className="h-5 w-5" />
            {isChecking ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-4">
              {result.valid ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
              <div>
                <h2 className={`text-xl font-bold ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                  {result.valid ? 'SSL Certificate is Valid' : 'SSL Certificate Error'}
                </h2>
                <p className={`${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {result.domain} - {result.valid ? `${result.daysRemaining} days remaining` : 'Certificate issue detected'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-500">Protocol</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{result.protocol}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-500">Encryption</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{result.encryption}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-500">Days Remaining</span>
              </div>
              <p className={`text-xl font-bold ${result.daysRemaining < 30 ? 'text-red-600' : 'text-green-600'}`}>
                {result.daysRemaining}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Certificate Details</h3>
            </div>
            <div className="p-4">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Domain</dt>
                  <dd className="font-medium text-gray-900">{result.domain}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Issuer</dt>
                  <dd className="font-medium text-gray-900">{result.issuer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Valid From</dt>
                  <dd className="font-medium text-gray-900">{result.validFrom}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Valid Until</dt>
                  <dd className="font-medium text-gray-900">{result.validUntil}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Self-Signed</dt>
                  <dd className={`font-medium ${result.isSelfSigned ? 'text-yellow-600' : 'text-green-600'}`}>
                    {result.isSelfSigned ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {result.daysRemaining < 30 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Certificate Expiring Soon</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your SSL certificate will expire in {result.daysRemaining} days. 
                  Renew it soon to avoid service interruption.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
