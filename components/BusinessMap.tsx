"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ankaraData from '@/data/ankara-data.json';

// Dynamic import of map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const BusinessMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Turkey center coordinates
  const turkeyCenter: [number, number] = [39.0, 35.0];
  const ankaraCoordinates: [number, number] = [ankaraData.coordinates[0], ankaraData.coordinates[1]];

  const handleMarkerClick = () => {
    setIsModalOpen(true);
  };

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  return (
    <>
      <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={turkeyCenter}
            zoom={6}
            className="w-full h-full"
            whenReady={handleMapLoad}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker 
              position={ankaraCoordinates}
              eventHandlers={{
                click: handleMarkerClick,
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">Ankara</h3>
                  <p className="text-sm text-gray-600">Capital of Turkey</p>
                  <p className="text-xs text-primary cursor-pointer" onClick={handleMarkerClick}>
                    Click for detailed information
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
        
        {!isMapLoaded && (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Ankara Information Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Ankara - Business Information
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-gray-700">{ankaraData.summary}</p>
            </div>

            {/* Advantages */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Regional Advantages</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="industry-mining">
                  <AccordionTrigger>Industry & Mining</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{ankaraData.advantages.industryMining}</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="agriculture">
                  <AccordionTrigger>Agriculture</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{ankaraData.advantages.agriculture}</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="services">
                  <AccordionTrigger>Services</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{ankaraData.advantages.services}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Priority Investments */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Priority Investments</h3>
              <p className="text-gray-700">{ankaraData.priorityInvestments}</p>
            </div>

            {/* Economic Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Economic Summary</h3>
              <p className="text-gray-700">{ankaraData.economicSummary}</p>
            </div>

            {/* Priority Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Priority Fields</h3>
              <p className="text-gray-700">{ankaraData.priorityFields}</p>
            </div>

            {/* Suggested Businesses */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Suggested Business Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ankaraData.suggestedBusinesses.map((business, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">{business}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessMap;