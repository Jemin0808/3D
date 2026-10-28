export interface BuildingFacility {
  name: string;
  type: 'lab' | 'office' | 'hall' | 'amenity';
  description: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  category: 'academic' | 'admin' | 'amenities' | 'hostel' | 'sports' | 'entrance';
  yearBuilt: number;
  floors: number;
  dimensions: {
    width: number; // in meters (X axis)
    length: number; // in meters (Z axis)
    height: number; // in meters (Y axis)
  };
  position: [number, number, number]; // [x, y, z] in campus coordinates
  rotationY?: number;
  color?: string;
  roofType?: 'flat' | 'sawtooth' | 'pitched' | 'modern';
  description: string;
  architectureDetails: string;
  departmentsHoused: string[];
  keyLabsAndFacilities: BuildingFacility[];
  historicalNote?: string;
  imageThumbnail?: string;
}

export const LDCE_CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: 'main-gate',
    name: 'Main Entrance Gate & Plaza',
    code: 'GATE-01',
    category: 'entrance',
    yearBuilt: 1948,
    floors: 1,
    dimensions: { width: 34, length: 8, height: 9 },
    position: [0, 0, 160],
    roofType: 'modern',
    description: 'Iconic classical red sandstone gateway of LDCE situated on Gujarat University Road, featuring the Ashoka pillar emblem, dual vehicular arches, pedestrian turnstiles, and security gatehouse.',
    architectureDetails: 'Red sandstone ornamental archway inspired by classical Gujarati stepwell lintels and colonial-modern institutional gateways, with engraved brass lettering in English and Gujarati script.',
    departmentsHoused: ['Security Directorate', 'Visitor Assistance Booth', 'Campus Gatehouse'],
    keyLabsAndFacilities: [
      { name: 'Security Control Post', type: 'office', description: '24/7 security monitoring & campus pass issuance' },
      { name: 'Visitor Information Kiosk', type: 'amenity', description: 'Campus navigation maps & guest registration' },
      { name: 'Main Boulevard Roundabout', type: 'amenity', description: 'Central roundabout with national flag & illuminated fountain' }
    ],
    historicalNote: 'Inaugurated as the main artery connecting the newly minted 1948 college grounds to Navrangpura and Gujarat University.',
    imageThumbnail: '/src/assets/images/ldce_entrance_gate_1791489885373.jpg'
  },
  {
    id: 'block-1-admin',
    name: 'Block 1 - Main Administrative Building & Principal Office',
    code: 'BLOCK-01',
    category: 'admin',
    yearBuilt: 1948,
    floors: 2,
    dimensions: { width: 52, length: 26, height: 11 },
    position: [0, 0, 85],
    roofType: 'flat',
    description: 'The historic administrative anchor of L.D. College of Engineering. Houses the Principal’s Chamber, Registrar, Academic Student Section, Establishment Branch, and Central Board Room.',
    architectureDetails: 'Exposed Ahmedabad terracotta brick masonry with reinforced concrete horizontal lintel bands, shaded deep-veranda entry portico supported by twin square brick pillars, and high cross-ventilated ceilings.',
    departmentsHoused: ['Principal Secretariat', 'Student Section & Accounts', 'Applied Mechanics Department', 'Rectorate Office'],
    keyLabsAndFacilities: [
      { name: 'Principal Chamber & Council Hall', type: 'office', description: 'Executive administrative headquarters of LDCE' },
      { name: 'Student Section (SAC)', type: 'office', description: 'Admissions, exam registrations, transcript issuance' },
      { name: 'Applied Mechanics Structural Lab', type: 'lab', description: 'Materials testing, universal testing machines, stress analysis' },
      { name: 'Central Conference Hall', type: 'hall', description: 'High-level syndicate meetings and faculty colloquiums' }
    ],
    historicalNote: 'Laid down by industrialist Kasturbhai Lalbhai in 1948, marking the inception of one of Gujarat’s earliest engineering colleges.',
    imageThumbnail: '/src/assets/images/ldce_campus_aerial_1791489869814.jpg'
  },
  {
    id: 'block-2-civil',
    name: 'Block 2 - Civil Engineering Department',
    code: 'BLOCK-02',
    category: 'academic',
    yearBuilt: 1950,
    floors: 2,
    dimensions: { width: 48, length: 32, height: 10.5 },
    position: [55, 0, 70],
    roofType: 'flat',
    description: 'Premier Civil & Environmental Engineering block with extensive open test yards, soil mechanics pits, concrete testing apparatus, and surveying instruments repository.',
    architectureDetails: 'C-shaped brick quadrangle enclosing an open-air testing yard. Heavy masonry walls to dampen vibration from cyclic structural load testing equipment.',
    departmentsHoused: ['Civil Engineering', 'Environmental Engineering', 'Water Resources'],
    keyLabsAndFacilities: [
      { name: 'Concrete Technology Lab', type: 'lab', description: 'Compressive test machines, slump cone apparatus, curing tanks' },
      { name: 'Geotechnical & Soil Mechanics Lab', type: 'lab', description: 'Triaxial shear testing, direct shear, consolidation apparatus' },
      { name: 'Surveying & GIS Geomatics Lab', type: 'lab', description: 'Total stations, digital theodolites, drone mapping workstations' },
      { name: 'Fluid Mechanics & Hydraulics Channel', type: 'lab', description: 'Open-channel flumes, venturi flumes, Pelton turbine test rigs' }
    ],
    historicalNote: 'NBA Accredited department that has trained over 10,000 civil engineers who built bridges, dams, and infrastructure across Gujarat.'
  },
  {
    id: 'block-3-mech',
    name: 'Block 3 - Mechanical Engineering Department',
    code: 'BLOCK-03',
    category: 'academic',
    yearBuilt: 1950,
    floors: 2,
    dimensions: { width: 56, length: 34, height: 10.5 },
    position: [-55, 0, 70],
    roofType: 'flat',
    description: 'One of LDCE’s flagship founding branches. Encompasses thermal engineering laboratories, refrigeration test plants, internal combustion engine benches, and fluid machinery bays.',
    architectureDetails: 'Long modular modernist brick pavilion with deep cantilevered solar fins (chhajjas) over continuous ribbon fenestrations, providing optimal thermal insulation during harsh Ahmedabad summers.',
    departmentsHoused: ['Mechanical Engineering', 'Thermal Engineering', 'Design Engineering'],
    keyLabsAndFacilities: [
      { name: 'Internal Combustion Engine Lab', type: 'lab', description: 'Multi-cylinder computerized petrol and diesel engine test rigs' },
      { name: 'Refrigeration & Air Conditioning Lab', type: 'lab', description: 'Vapor compression and absorption chillers, psychrometric chambers' },
      { name: 'Heat Transfer & Fluid Dynamics Bay', type: 'lab', description: 'Concentric tube exchangers, thermal conductivity measurement' },
      { name: 'Dynamics of Machinery (DOM) Lab', type: 'lab', description: 'Gyroscopes, balancing machines, cam analysis mechanisms' }
    ],
    historicalNote: 'Holds NBA accreditation and has consistently spawned student formula racing and rover engineering teams.'
  },
  {
    id: 'block-4-electrical',
    name: 'Block 4 - Electrical Engineering Department',
    code: 'BLOCK-04',
    category: 'academic',
    yearBuilt: 1952,
    floors: 2,
    dimensions: { width: 50, length: 30, height: 10.5 },
    position: [60, 0, 15],
    roofType: 'flat',
    description: 'Dedicated electrical engineering complex housing heavy AC/DC machines, high voltage surge test generators, protection switchgear panels, and power electronics consoles.',
    architectureDetails: 'Dual-bay brick structure with double-height ceiling for heavy transformers and isolated earthing grids meeting high-voltage lab safety protocols.',
    departmentsHoused: ['Electrical Engineering', 'Power Systems', 'Control & Instrumentation'],
    keyLabsAndFacilities: [
      { name: 'Heavy Electrical Machines Lab', type: 'lab', description: 'Synchronous alternators, induction motors, dynamometers' },
      { name: 'High Voltage Testing Lab', type: 'lab', description: 'Impulse generator, dielectric oil breakdown testing setup' },
      { name: 'Power System Protection & Switchgear', type: 'lab', description: 'Numerical relays, circuit breaker models, SCADA simulators' },
      { name: 'Power Electronics & Drive Lab', type: 'lab', description: 'Thyristor drives, inverter circuits, DSP motion controllers' }
    ],
    historicalNote: 'Established with assistance from early industrial pioneers in Ahmedabad to support regional power grid electrification.'
  },
  {
    id: 'block-5-chem',
    name: 'Block 5 - Chemical Engineering, Plastic & Rubber Tech',
    code: 'BLOCK-05',
    category: 'academic',
    yearBuilt: 1963,
    floors: 2,
    dimensions: { width: 46, length: 28, height: 10.5 },
    position: [-60, 0, 15],
    roofType: 'flat',
    description: 'Comprehensive chemical process engineering and polymer technology center, featuring pilot distillation columns, fluidization towers, polymer extruders, and vulcanizers.',
    architectureDetails: 'Corrosion-resistant treated brick masonry with elevated ventilation stacks and external service piping shafts for chemical exhaust management.',
    departmentsHoused: ['Chemical Engineering', 'Plastic Technology', 'Rubber Technology'],
    keyLabsAndFacilities: [
      { name: 'Mass Transfer & Distillation Unit', type: 'lab', description: 'Packed & plate distillation columns, absorption columns' },
      { name: 'Reaction Engineering Pilot Lab', type: 'lab', description: 'CSTR, tubular plug flow reactors, batch reactors' },
      { name: 'Polymer Processing & Extrusion Shop', type: 'lab', description: 'Twin screw extruders, injection moulding machines' },
      { name: 'Rubber Compound Testing Lab', type: 'lab', description: 'Moving die rheometers, Mooney viscometers, tensile testers' }
    ],
    historicalNote: 'Vital contributor to Gujarat’s world-renowned petrochemical, pharmaceuticals, and dyes/pigments industrial belt.'
  },
  {
    id: 'block-6-workshop',
    name: 'Block 6 - Central Workshop & Automobile Engineering',
    code: 'BLOCK-06',
    category: 'academic',
    yearBuilt: 1950,
    floors: 1,
    dimensions: { width: 68, length: 42, height: 9.5 },
    position: [-55, 0, -45],
    roofType: 'sawtooth',
    description: 'Massive industrial central manufacturing workshop and Automobile Engineering hangar. Houses heavy lathe lines, shaper machines, welding bays, smithy, carpentry, foundry, and chassis hoist.',
    architectureDetails: 'Iconic industrial saw-tooth clerestory roof geometry directing glare-free northern daylight into the fabrication floor, supported by steel Pratt trusses.',
    departmentsHoused: ['Central Workshop', 'Automobile Engineering', 'Manufacturing Technology'],
    keyLabsAndFacilities: [
      { name: 'Machine Shop Bay', type: 'lab', description: 'Engine lathes, universal milling machines, radial drill presses' },
      { name: 'Automobile Chassis & Dyno Bay', type: 'lab', description: 'Vehicle chassis dynamometer, suspension analyzers, engine hoist' },
      { name: 'Welding & Fabrication Section', type: 'lab', description: 'TIG/MIG welding sets, submerged arc welding, spot welding' },
      { name: 'Foundry & Pattern Making Shop', type: 'lab', description: 'Pit furnaces, green sand molding benches, core baking oven' }
    ],
    historicalNote: 'Every single LDCE engineering freshman undergoes practical hands-on workshop training here as part of their foundation curriculum.'
  },
  {
    id: 'block-7-siemens-coe',
    name: 'Block 7 - Computer & IT Dept / Siemens Centre of Excellence',
    code: 'BLOCK-07',
    category: 'academic',
    yearBuilt: 2013,
    floors: 3,
    dimensions: { width: 58, length: 36, height: 14.5 },
    position: [55, 0, -45],
    roofType: 'modern',
    description: 'State-of-the-art contemporary high-tech hub housing the Computer Engineering Department, Information Technology Department, and the multi-crore Siemens Centre of Excellence (CoE).',
    architectureDetails: 'Contemporary modernist red brick facade integrated with high-performance tinted ribbon curtain glass, dark steel solar louvers, grand double-height glass reception atrium.',
    departmentsHoused: ['Computer Engineering', 'Information Technology', 'Siemens Centre of Excellence (CoE)'],
    keyLabsAndFacilities: [
      { name: 'Siemens Robotics & Automation Lab', type: 'lab', description: 'Industrial 6-axis robotic arms, Siemens S7-1500 PLCs' },
      { name: 'Product Design & Validation (CAD/CAM/PLM)', type: 'lab', description: 'Siemens NX, Teamcenter PLM, high-end design workstations' },
      { name: 'CIM Simulation & Rapid Prototyping', type: 'lab', description: 'Industrial 3D printers, CNC vertical machining centers' },
      { name: 'Advanced AI & High Performance Computing', type: 'lab', description: 'GPU compute clusters, deep learning neural workstations' },
      { name: 'Internet of Things (IoT) Incubator', type: 'lab', description: 'Embedded sensors, edge gateway testbeds, smart city prototypes' }
    ],
    historicalNote: 'Established as an apex technology partnership between the Government of Gujarat and Siemens Industry Software to create industry-ready engineers.',
    imageThumbnail: '/src/assets/images/ldce_siemens_coe_1791489898833.jpg'
  },
  {
    id: 'central-library',
    name: 'Central Library Knowledge Pavilion',
    code: 'LIB-CENTRAL',
    category: 'academic',
    yearBuilt: 1968,
    floors: 2,
    dimensions: { width: 44, length: 28, height: 10 },
    position: [0, 0, -5],
    roofType: 'flat',
    description: 'Two-storey central library knowledge repository with over 100,000 textbooks, reference manuscripts, international IEEE/ASME journals, air-conditioned e-library hall, and silent reading zones.',
    architectureDetails: 'Luminescent brick and precast concrete waffle-slab pavilion with acoustic insulated ceilings, large glass windows facing north gardens, and central open atrium.',
    departmentsHoused: ['Central Library Services', 'E-Resource Centre', 'Circulation & Book Bank'],
    keyLabsAndFacilities: [
      { name: 'Main Reading Hall', type: 'hall', description: '250+ seating capacity silent study space with high-speed campus Wi-Fi' },
      { name: 'Digital E-Library & Research Lab', type: 'lab', description: 'Terminals accessing IEEE Xplore, ScienceDirect, NPTEL archives' },
      { name: 'Book Bank & Reference Archives', type: 'amenity', description: 'Extensive lending collection supporting all 14 engineering disciplines' }
    ],
    historicalNote: 'Renovated with modern automated RFID circulation and continuous student study lounges.'
  },
  {
    id: 'annexe-pg-block',
    name: 'Annexe Building & PG Studies Complex',
    code: 'ANNEXE-01',
    category: 'academic',
    yearBuilt: 1995,
    floors: 3,
    dimensions: { width: 48, length: 26, height: 13 },
    position: [0, 0, -55],
    roofType: 'flat',
    description: 'Postgraduate education and research center housing M.E./M.Tech classrooms, faculty research laboratories, conference hall, and multidisciplinary project spaces.',
    architectureDetails: 'Three-storey brick frame structure with projecting geometric balconies, shaded stair towers, and wide corridors connecting to adjacent seminar blocks.',
    departmentsHoused: ['Postgraduate Studies Cell', 'Biomedical & Instrumentation Research', 'Examination Wing'],
    keyLabsAndFacilities: [
      { name: 'Central Examination Control Centre', type: 'office', description: 'Secure university evaluation and online exam administration' },
      { name: 'PG Seminar & Auditorium Hall', type: 'hall', description: '200-seat tiered audio-visual auditorium for technical symposiums' },
      { name: 'Multidisciplinary Innovation Lab', type: 'lab', description: 'Student patent drafting and hardware startup prototype benches' }
    ]
  },
  {
    id: 'canteen-hub',
    name: 'Student Canteen & Campus Plaza',
    code: 'CANTEEN-01',
    category: 'amenities',
    yearBuilt: 1975,
    floors: 1,
    dimensions: { width: 32, length: 22, height: 5.5 },
    position: [-60, 0, -100],
    roofType: 'pitched',
    description: 'Vibrant social epicentre of LDCE campus. Features the main student canteen, famous Nescafe tea corner, Amul ice cream parlour, and shaded outdoor benches under mature banyan trees.',
    architectureDetails: 'Open-air pavilion layout with pitched Mangalore tile canopy, breezeway verandas, and natural cross-air circulation.',
    departmentsHoused: ['Student Canteen Services', 'Campus Co-operative Store'],
    keyLabsAndFacilities: [
      { name: 'Main Food Hall', type: 'amenity', description: 'Fresh vegetarian meals, Gujarati thali, snacks, chai, and coffee' },
      { name: 'Student Stationary & Photocopy Store', type: 'amenity', description: 'Engineering drawing tools, lab manuals, textbook prints' },
      { name: 'Banyan Tree Gathering Circle (Chabutro)', type: 'amenity', description: 'Traditional open-air discussion grove for student club activities' }
    ],
    historicalNote: 'The heart of LDCE student memories, cultural fests (Lakshya), and debate circles since decades.'
  },
  {
    id: 'hostel-complex',
    name: 'Hostel Quadrangle (Blocks A to H)',
    code: 'HOSTEL-QUAD',
    category: 'hostel',
    yearBuilt: 1952,
    floors: 3,
    dimensions: { width: 75, length: 50, height: 12 },
    position: [60, 0, -115],
    roofType: 'flat',
    description: 'Student residential quarters accommodating over 780 students in twin/triple-sharing rooms, featuring student mess halls, indoor sports room, reading library, and green central courtyard.',
    architectureDetails: 'Interconnected U-shaped brick hostel wings designed with central landscaped courtyards that optimize natural air flow and social interaction.',
    departmentsHoused: ['Hostel Rector Office', 'Mess Committee', 'Student Welfare Committee'],
    keyLabsAndFacilities: [
      { name: 'Student Dining Mess 1 & 2', type: 'amenity', description: 'Nutritious vegetarian meals managed under student mess committee' },
      { name: 'Recreation & Gymnasium Room', type: 'amenity', description: 'Table tennis, carrom, chess, free weights, and fitness gear' },
      { name: 'Hostel Study & Computer Lounge', type: 'amenity', description: 'Late-night study hall equipped with high-speed Wi-Fi' }
    ]
  },
  {
    id: 'sports-ground',
    name: 'LDCE Sports Arena & Cricket Ground',
    code: 'SPORTS-01',
    category: 'sports',
    yearBuilt: 1950,
    floors: 1,
    dimensions: { width: 90, length: 70, height: 4 },
    position: [-100, 0, 10],
    roofType: 'flat',
    description: 'Expansive natural turf sports complex featuring a full-scale cricket pitch, football ground, 400m running track, outdoor volleyball court, basketball hardcourt, and pavilion stand.',
    architectureDetails: 'Lush grass field enclosed by neem and eucalyptus groves, with a covered spectator pavilion stand and LED sports floodlighting masts.',
    departmentsHoused: ['Physical Education Directorate', 'LDCE Sports Club'],
    keyLabsAndFacilities: [
      { name: 'Turf Cricket Pitch & Nets', type: 'amenity', description: 'Standard regulation clay cricket pitch with practice bowling nets' },
      { name: 'Basketball & Volleyball Hardcourts', type: 'amenity', description: 'Synthetic coated courts with floodlighting for evening tournaments' },
      { name: 'Athletic Track & Pavilion', type: 'amenity', description: 'Annual sports day athletic sprints, long jump pit, spectator seating' }
    ],
    historicalNote: 'Host ground for inter-college GTU cricket championships and the annual sports festival.'
  }
];

export interface LandmarkTourPoint {
  id: string;
  name: string;
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  buildingId: string;
}

export const CAMPUS_TOUR_STOPS: LandmarkTourPoint[] = [
  {
    id: 'aerial-overview',
    name: 'Campus Aerial Panorama',
    cameraPosition: [0, 110, 210],
    targetPosition: [0, 5, 10],
    description: 'Breathtaking bird-eye view of the entire 60-acre LDCE campus, showcasing the historic red-brick architectural quadrangle, green tree canopy, and University Road layout.',
    buildingId: 'block-1-admin'
  },
  {
    id: 'main-gate-stop',
    name: 'Main Heritage Gate & Plaza',
    cameraPosition: [0, 12, 185],
    targetPosition: [0, 5, 160],
    description: 'The monumental entrance gate on Gujarat University Road, featuring classical red sandstone arches and the national emblem.',
    buildingId: 'main-gate'
  },
  {
    id: 'admin-block-stop',
    name: 'Block 1 - Administration & Principal Office',
    cameraPosition: [0, 15, 125],
    targetPosition: [0, 6, 85],
    description: 'The historic 1948 administrative heart of the college, with its signature brick veranda, central lawn, and flagpole.',
    buildingId: 'block-1-admin'
  },
  {
    id: 'civil-block-stop',
    name: 'Block 2 - Civil Engineering Quad',
    cameraPosition: [55, 16, 105],
    targetPosition: [55, 6, 70],
    description: 'The Civil & Environmental engineering complex with its structural test yards and concrete research facilities.',
    buildingId: 'block-2-civil'
  },
  {
    id: 'mech-block-stop',
    name: 'Block 3 - Mechanical Engineering Block',
    cameraPosition: [-55, 16, 105],
    targetPosition: [-55, 6, 70],
    description: 'Flagship mechanical engineering pavilion with deep solar louvers and automotive thermal laboratories.',
    buildingId: 'block-3-mech'
  },
  {
    id: 'workshop-stop',
    name: 'Block 6 - Central Workshop (Sawtooth Roof)',
    cameraPosition: [-55, 15, -15],
    targetPosition: [-55, 5, -45],
    description: 'The iconic manufacturing workshop with classic sawtooth industrial roofs, lathe shops, foundry, and automobile labs.',
    buildingId: 'block-6-workshop'
  },
  {
    id: 'siemens-coe-stop',
    name: 'Block 7 - Siemens Centre of Excellence & Computer Dept',
    cameraPosition: [55, 18, -15],
    targetPosition: [55, 8, -45],
    description: 'State-of-the-art modern academic wing with reflective ribbon curtain glass, 9 Siemens advanced technology laboratories, and AI/IoT incubators.',
    buildingId: 'block-7-siemens-coe'
  },
  {
    id: 'library-stop',
    name: 'Central Library Knowledge Pavilion',
    cameraPosition: [0, 14, 25],
    targetPosition: [0, 5, -5],
    description: 'Two-storey knowledge sanctuary with digital e-library, journal archives, and expansive reading spaces.',
    buildingId: 'central-library'
  },
  {
    id: 'sports-stop',
    name: 'Cricket Ground & Sports Complex',
    cameraPosition: [-100, 18, 55],
    targetPosition: [-100, 3, 10],
    description: 'Lush natural turf cricket ground, athletic running track, and floodlit basketball courts.',
    buildingId: 'sports-ground'
  },
  {
    id: 'canteen-hostel-stop',
    name: 'Student Canteen & Hostel Hub',
    cameraPosition: [-50, 16, -70],
    targetPosition: [-60, 3, -100],
    description: 'The lively student hangout plaza with open-air canteen, Amul parlour, and adjacent residential hostel quadrangles.',
    buildingId: 'canteen-hub'
  }
];

export const CAMPUS_METRICS = {
  institutionName: 'L.D. College of Engineering (LDCE)',
  location: 'Opposite Gujarat University, Navrangpura, Ahmedabad 380015, Gujarat, India',
  established: 1948,
  founder: 'Kasturbhai Lalbhai (Named after Sheth Lalbhai Dalpatbhai)',
  affiliation: 'Gujarat Technological University (GTU) / Directorate of Technical Education (DTE)',
  campusAreaAcres: 60,
  campusAreaSqM: 242811,
  totalDepartments: 14,
  studentBody: 6500,
  facultyCount: 280,
  architectureIdiom: 'Ahmedabad Vernacular Modernist Brick Architecture (Exposed red brick masonry with reinforced concrete bands and climate-responsive louvers)'
};
