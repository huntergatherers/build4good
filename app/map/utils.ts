import * as L from 'leaflet';

export function getMarkerIcon(role : string) {
  const markerScale = 2;
  const markerWidth = 8;
  const markerHeight = 20;
  switch (role) {
    case 'Donor':
      return L.icon({
        iconUrl: '/icons/donors.svg',
        iconRetinaUrl: '/icons/donors.svg',
        iconAnchor: [markerWidth * markerScale, markerHeight * markerScale],
        tooltipAnchor: [0, (-markerHeight / 2) * markerScale],
      });

    case 'Compostor':
      return L.icon({
        iconUrl: '/icons/compostors.svg',
        iconRetinaUrl: '/icons/compostors.svg',
        iconAnchor: [markerWidth * markerScale, markerHeight * markerScale],
        tooltipAnchor: [0, (-markerHeight / 2) * markerScale],
      });

    default:
      return L.icon({
        iconUrl: '/icons/gardeners.svg',
        iconRetinaUrl: '/icons/gardeners.svg',
        iconAnchor: [markerWidth * markerScale, markerHeight * markerScale],
        tooltipAnchor: [0, (-markerHeight / 2) * markerScale],
      });
  }
}