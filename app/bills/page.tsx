'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Bill {
  id: number;
  title: string;
  description: string;
  currentStage: string;
  categories: string[];
  sponsors: string[];
  cosponsors: string[];
  portfolioMinisters: string[];
  shadowMinisters: string[];
  introducedDate: string;
  updatedDate: string;
  isTracked: boolean;
  stageHistory: Array<{
    stage: string;
    date: string;
  }>;
  originatingHouse: string;
  parliamentNumber: string;
  sessionNumber: string;
  sourceUrl: string;
}

// Simple fetch function for bills data
const fetchBills = async (): Promise<Bill[]> => {
  const response = await fetch('/api/bills');
  if (!response.ok) {
    throw new Error('Failed to fetch bills');
  }
  return response.json();
};

// Helper function to format stage names
const formatStage = (stage: string): string => {
  return stage
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Fetch bills data using TanStack Query
  const {
    data: bills = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bills'],
    queryFn: fetchBills,
  });

  // Filter bills based on search term
  const filteredBills = bills.filter(
    (bill) =>
      bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.sponsors.some((sponsor) =>
        sponsor.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const handleBackToList = () => {
    setSelectedBill(null);
  };

  if (isLoading) {
    return (
      <div className="bills">
        <div className="bills__loading">Loading bills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bills">
        <div className="bills__error">
          Error loading bills:{' '}
          {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  // Show details view if a bill is selected
  if (selectedBill) {
    return (
      <div className="bills">
        <button className="bills__back-button" onClick={handleBackToList}>
          ← Back to Bills List
        </button>

        <div className="bills__details">
          <div className="bills__details-header">
            <h1 className="bills__details-title">{selectedBill.title}</h1>
            <p className="bills__details-description">
              {selectedBill.description !== 'No description available'
                ? selectedBill.description
                : 'No description provided for this bill.'}
            </p>
          </div>

          <div className="bills__details-meta">
            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Current Stage</h3>
              <div className="bills__details-section-content">
                {formatStage(selectedBill.currentStage)}
              </div>
            </div>

            <div className="bills__details-section">
              <h3 className="bills__details-section-title">
                Originating House
              </h3>
              <div className="bills__details-section-content">
                {selectedBill.originatingHouse}
              </div>
            </div>

            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Parliament</h3>
              <div className="bills__details-section-content">
                {selectedBill.parliamentNumber}th Parliament, Session{' '}
                {selectedBill.sessionNumber}
              </div>
            </div>

            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Introduced Date</h3>
              <div className="bills__details-section-content">
                {formatDate(selectedBill.introducedDate)}
              </div>
            </div>

            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Last Updated</h3>
              <div className="bills__details-section-content">
                {formatDate(selectedBill.updatedDate)}
              </div>
            </div>

            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Status</h3>
              <div className="bills__details-section-content">
                {selectedBill.isTracked ? 'Tracked' : 'Not Tracked'}
              </div>
            </div>
          </div>

          <div className="bills__details-section">
            <h3 className="bills__details-section-title">Sponsors</h3>
            <ul className="bills__details-section-list">
              {selectedBill.sponsors.map((sponsor, index) => (
                <li key={index} className="bills__details-section-list-item">
                  {sponsor}
                </li>
              ))}
            </ul>
          </div>

          {selectedBill.cosponsors.length > 0 && (
            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Co-sponsors</h3>
              <ul className="bills__details-section-list">
                {selectedBill.cosponsors.map((cosponsor, index) => (
                  <li key={index} className="bills__details-section-list-item">
                    {cosponsor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedBill.portfolioMinisters.length > 0 && (
            <div className="bills__details-section">
              <h3 className="bills__details-section-title">
                Portfolio Ministers
              </h3>
              <ul className="bills__details-section-list">
                {selectedBill.portfolioMinisters.map((minister, index) => (
                  <li key={index} className="bills__details-section-list-item">
                    {minister}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedBill.shadowMinisters.length > 0 && (
            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Shadow Ministers</h3>
              <ul className="bills__details-section-list">
                {selectedBill.shadowMinisters.map((minister, index) => (
                  <li key={index} className="bills__details-section-list-item">
                    {minister}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bills__details-stage-history">
            <h3 className="bills__details-stage-history-title">
              Stage History
            </h3>
            <ul className="bills__details-stage-list">
              {selectedBill.stageHistory.map((stage, index) => (
                <li key={index} className="bills__details-stage-item">
                  <span className="bills__details-stage-name">
                    {formatStage(stage.stage)}
                  </span>
                  <span className="bills__details-stage-date">
                    {formatDate(stage.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {selectedBill.sourceUrl && (
            <div className="bills__details-section">
              <h3 className="bills__details-section-title">Source</h3>
              <div className="bills__details-section-content">
                <a
                  href={selectedBill.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Parliament Website
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show list view
  return (
    <div className="bills">
      <div className="bills__header">
        <h1 className="bills__title">Parliamentary Bills</h1>
        <p className="bills__subtitle">
          Browse and search through current parliamentary bills
        </p>
      </div>

      <div className="bills__search">
        <input
          type="text"
          className="bills__search-input"
          placeholder="Search bills by title, description, or sponsor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBills.length === 0 ? (
        <div className="bills__empty">
          {searchTerm
            ? 'No bills found matching your search.'
            : 'No bills available.'}
        </div>
      ) : (
        <div className="bills__list">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="bills__item"
              onClick={() => handleBillClick(bill)}
            >
              <h3 className="bills__item-title">{bill.title}</h3>
              <p className="bills__item-description">
                {bill.description !== 'No description available'
                  ? bill.description
                  : 'No description available'}
              </p>
              <div className="bills__item-meta">
                <span className="bills__item-stage">
                  {formatStage(bill.currentStage)}
                </span>
                <span className="bills__item-date">
                  Introduced: {formatDate(bill.introducedDate)}
                </span>
                {bill.isTracked && (
                  <span className="bills__item-tracked">Tracked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
