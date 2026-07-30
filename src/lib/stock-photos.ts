// Curated, verified-working Pexels photo IDs grouped by theme — real,
// content-appropriate photography (free-to-use, no attribution required)
// standing in for final approved TNeGA photography, per the placeholder
// policy: never a random/irrelevant image, never a debug gray box.

export function pexelsPhoto(id: number, width = 800, height?: number) {
  const dims = height ? `&w=${width}&h=${height}&fit=crop` : `&w=${width}`;
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb${dims}`;
}

export const STOCK = {
  studentLaptop: 4622108, // Indian students studying together with a laptop
  elderlyWomanPhone: 6838547, // elderly woman looking at her cellphone
  elderlyManPhone: 8185916, // elderly man holding a smartphone
  ruralWomanPhone: 5838215, // woman with a mobile phone
  womanPhone: 6146657, // woman using her mobile phone
  developer: 36706460, // developer coding in a modern office
  programmer: 12899156, // programmer in office
  serverRacks: 5203849, // server racks
  dataCenter: 37730212, // data center server racks, active equipment
  serverRoom: 4508751, // server racks in a data center
  networkRack: 17323801, // network rack
  itTechnician: 37605911, // IT technician working in a data center server room
  engineerAudit: 19226354, // engineer inspecting/fixing a core switch
  handshakeFormal: 33175650, // professional handshake in a business meeting
  handshakeLeaders: 8847169, // two people in business attire shaking hands
  handshakeBusiness: 8069428, // business partners shaking hands
  handshakeCloseup: 4963436, // close-up of business people shaking hands
  presentation: 3321791, // seminar speaker engaging an audience
  workshopGroup: 33714873, // diverse group in an engaging indoor workshop
  attentiveGroup: 18999484, // attentive group during a presentation
  officeBuilding: 17391303, // modern office buildings, India
} as const;

/** Rotation pool used for the hero district map's per-district photo
 * reveal — cycles through real, on-theme photography rather than one
 * random image per district. */
export const DISTRICT_PHOTO_POOL: number[] = [
  STOCK.studentLaptop,
  STOCK.elderlyWomanPhone,
  STOCK.elderlyManPhone,
  STOCK.ruralWomanPhone,
  STOCK.womanPhone,
  STOCK.developer,
  STOCK.programmer,
  STOCK.serverRacks,
  STOCK.dataCenter,
  STOCK.serverRoom,
  STOCK.networkRack,
  STOCK.itTechnician,
  STOCK.engineerAudit,
  STOCK.handshakeFormal,
  STOCK.handshakeLeaders,
  STOCK.handshakeBusiness,
  STOCK.handshakeCloseup,
  STOCK.presentation,
  STOCK.workshopGroup,
  STOCK.attentiveGroup,
  STOCK.officeBuilding,
];
