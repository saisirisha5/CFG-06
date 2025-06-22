const mongoose = require('mongoose');
const CounsellingSession = require('../models/CounsellingSession');
const Counsellor = require('../models/Counsellor');
const Household = require('../models/Household');
const SurveyResponse = require('../models/SurveyResponse');
const Admin = require('../models/Admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// 5 Example Regions with detailed data
const exampleRegions = [
    {
        name: "Rural Health Initiative - Uttar Pradesh",
        address: "Village: Ramnagar, District: Varanasi, Uttar Pradesh",
        scheduledDateTime: new Date('2024-01-15T09:00:00Z'),
        durationMinutes: 120,
        location: {
            type: 'Point',
            coordinates: [82.9739, 25.3176] // Varanasi coordinates
        },
        regionalData: {
            population: 2500,
            literacyRate: 65,
            primaryOccupation: "Agriculture",
            commonHealthIssues: ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
            healthcareFacilities: ["Primary Health Center - 5km away", "Community Health Worker - Available"],
            economicStatus: "Low to Middle",
            culturalFactors: ["Traditional medicine practices", "Gender-based health disparities", "Large family sizes"],
            environmentalFactors: ["Open defecation", "Contaminated water sources", "Poor sanitation"],
            governmentSchemes: ["Ayushman Bharat", "PM-JAY", "National Health Mission"],
            demographics: "Mixed population with 60% rural, 40% semi-urban. Age distribution: 30% children, 50% working age, 20% elderly",
            nutritionStatus: "Moderate malnutrition rates, limited access to diverse food sources, seasonal food insecurity",
            healthTrends: "Increasing cases of water-borne diseases, improving maternal health awareness, vaccination gaps in remote areas",
            serviceGaps: "Limited specialist healthcare, poor road connectivity, inadequate emergency services",
            behavioralData: "Traditional health practices prevalent, low health-seeking behavior, gender-based health disparities",
            educationLevels: "Primary education available, secondary education limited, health literacy low",
            languageTechAccess: "Hindi and local dialects, limited smartphone usage, radio and TV main communication channels"
        }
    },
    {
        name: "Urban Slum Health Program - Mumbai",
        address: "Dharavi Slum, Ward 185, Mumbai, Maharashtra",
        scheduledDateTime: new Date('2024-02-20T10:00:00Z'),
        durationMinutes: 90,
        location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Mumbai coordinates
        },
        regionalData: {
            population: 8500,
            literacyRate: 78,
            primaryOccupation: "Informal sector",
            commonHealthIssues: ["Respiratory diseases", "Tuberculosis", "Malnutrition", "Mental health", "Substance abuse"],
            healthcareFacilities: ["Municipal dispensary - 2km", "Private clinics - Available", "Mobile health units"],
            economicStatus: "Low",
            culturalFactors: ["Multi-ethnic population", "Migrant workers", "Language barriers"],
            environmentalFactors: ["Overcrowding", "Poor ventilation", "Sanitation issues", "Air pollution"],
            governmentSchemes: ["PM-JAY", "Urban Health Mission", "Slum Rehabilitation"],
            demographics: "Dense urban population, 70% migrants, 30% local residents. High population density with mixed age groups",
            nutritionStatus: "Food insecurity common, limited cooking facilities, reliance on street food and packaged items",
            healthTrends: "Rising respiratory issues due to pollution, increasing mental health concerns, substance abuse among youth",
            serviceGaps: "Overcrowded healthcare facilities, long waiting times, limited mental health services",
            behavioralData: "High stress levels, irregular eating patterns, limited exercise, substance abuse prevalent",
            educationLevels: "Basic literacy present, limited formal education, vocational training available",
            languageTechAccess: "Multiple languages (Hindi, Marathi, English), high smartphone penetration, social media usage"
        }
    },
    {
        name: "Tribal Health Outreach - Odisha",
        address: "Koraput District, Tribal Village Cluster, Odisha",
        scheduledDateTime: new Date('2024-03-10T08:00:00Z'),
        durationMinutes: 150,
        location: {
            type: 'Point',
            coordinates: [82.7239, 18.8097] // Koraput coordinates
        },
        regionalData: {
            population: 1800,
            literacyRate: 45,
            primaryOccupation: "Forest-based livelihoods",
            commonHealthIssues: ["Malaria", "Malnutrition", "Maternal mortality", "Child mortality", "Sickle cell anemia"],
            healthcareFacilities: ["Mobile medical units", "ASHA workers", "Traditional healers"],
            economicStatus: "Very Low",
            culturalFactors: ["Indigenous healing practices", "Language barriers", "Geographic isolation"],
            environmentalFactors: ["Forest environment", "Seasonal access issues", "Wildlife encounters"],
            governmentSchemes: ["Tribal Health Plan", "National Health Mission", "PM-JAY"],
            demographics: "Indigenous tribal population, 80% forest dwellers, 20% semi-urban. Traditional family structures",
            nutritionStatus: "Severe malnutrition common, limited access to diverse foods, seasonal food shortages",
            healthTrends: "High maternal and child mortality, genetic disorders prevalent, improving vaccination coverage",
            serviceGaps: "Geographic isolation, limited healthcare infrastructure, language barriers with healthcare providers",
            behavioralData: "Strong traditional beliefs, resistance to modern medicine, community-based decision making",
            educationLevels: "Low literacy rates, traditional knowledge systems, limited formal education",
            languageTechAccess: "Tribal languages, limited technology access, oral communication traditions"
        }
    },
    {
        name: "Coastal Community Health - Kerala",
        address: "Fishing Village: Chellanam, Ernakulam District, Kerala",
        scheduledDateTime: new Date('2024-04-05T09:30:00Z'),
        durationMinutes: 100,
        location: {
            type: 'Point',
            coordinates: [76.2673, 9.9312] // Ernakulam coordinates
        },
        regionalData: {
            population: 3200,
            literacyRate: 95,
            primaryOccupation: "Fishing and tourism",
            commonHealthIssues: ["Occupational injuries", "Skin diseases", "Mental health", "Alcoholism", "Hypertension"],
            healthcareFacilities: ["Community Health Center - 3km", "Private hospitals", "Ayurvedic centers"],
            economicStatus: "Middle",
            culturalFactors: ["High literacy", "Healthcare awareness", "Traditional medicine"],
            environmentalFactors: ["Coastal climate", "Monsoon challenges", "Sea-related hazards"],
            governmentSchemes: ["Kerala Health Mission", "PM-JAY", "Fisheries welfare schemes"],
            demographics: "Coastal fishing community, 60% fishermen, 40% tourism workers. Mixed age distribution with strong family bonds",
            nutritionStatus: "Good access to fish protein, seasonal variations in diet, traditional cooking practices",
            healthTrends: "Occupational hazards from fishing, lifestyle diseases increasing, mental health awareness growing",
            serviceGaps: "Limited specialist care for occupational injuries, mental health services needed, emergency response challenges",
            behavioralData: "Strong community bonds, traditional health practices, increasing health awareness",
            educationLevels: "High literacy rates, good educational infrastructure, health education programs",
            languageTechAccess: "Malayalam and English, good technology adoption, social media and mobile usage high"
        }
    },
    {
        name: "Industrial Worker Health - Gujarat",
        address: "Industrial Area: Vapi, Valsad District, Gujarat",
        scheduledDateTime: new Date('2024-05-15T08:00:00Z'),
        durationMinutes: 120,
        location: {
            type: 'Point',
            coordinates: [72.8777, 20.5937] // Gujarat coordinates (approximate for Vapi)
        },
        regionalData: {
            population: 12000,
            literacyRate: 82,
            primaryOccupation: "Industrial work",
            commonHealthIssues: ["Occupational diseases", "Respiratory problems", "Stress disorders", "Reproductive health", "Cancer risks"],
            healthcareFacilities: ["ESIC hospitals", "Private clinics", "Occupational health centers"],
            economicStatus: "Middle to High",
            culturalFactors: ["Migrant workers", "Nuclear families", "Work-life imbalance"],
            environmentalFactors: ["Industrial pollution", "Chemical exposure", "Noise pollution"],
            governmentSchemes: ["ESIC", "PM-JAY", "Industrial health regulations"],
            demographics: "Industrial workforce, 70% migrant workers, 30% local residents. Young working population",
            nutritionStatus: "Factory canteen food, irregular eating patterns, limited home cooking, packaged food consumption",
            healthTrends: "Occupational health issues rising, respiratory problems common, stress-related disorders increasing",
            serviceGaps: "Limited occupational health specialists, mental health services needed, emergency response coordination",
            behavioralData: "Work stress, irregular schedules, limited family time, substance use for stress relief",
            educationLevels: "Technical education common, safety training provided, continuous learning programs",
            languageTechAccess: "Gujarati, Hindi, English, high technology usage, digital communication platforms"
        }
    }
];

// Additional sessions for better data spread
const additionalSessions = [
    {
        name: "Rural Health Follow-up - Uttar Pradesh",
        address: "Village: Chandauli, District: Varanasi, Uttar Pradesh",
        scheduledDateTime: new Date('2024-06-10T09:00:00Z'),
        durationMinutes: 90,
        location: {
            type: 'Point',
            coordinates: [83.2679, 25.2583] // Chandauli coordinates
        },
        regionalData: {
            population: 1800,
            literacyRate: 60,
            primaryOccupation: "Agriculture",
            commonHealthIssues: ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
            healthcareFacilities: ["Primary Health Center - 8km away", "Community Health Worker - Available"],
            economicStatus: "Low",
            culturalFactors: ["Traditional medicine practices", "Gender-based health disparities", "Large family sizes"],
            environmentalFactors: ["Open defecation", "Contaminated water sources", "Poor sanitation"],
            governmentSchemes: ["Ayushman Bharat", "PM-JAY", "National Health Mission"],
            demographics: "Rural population, 70% agricultural workers, 30% daily wage laborers",
            nutritionStatus: "High malnutrition rates, limited food diversity, seasonal hunger",
            healthTrends: "Persistent water-borne diseases, low vaccination rates, poor maternal health",
            serviceGaps: "No specialist healthcare, poor road connectivity, no emergency services",
            behavioralData: "Strong traditional beliefs, very low health-seeking behavior, gender discrimination",
            educationLevels: "Low literacy, limited education access, no health education",
            languageTechAccess: "Hindi only, no technology access, radio main communication"
        }
    },
    {
        name: "Urban Health Extension - Mumbai",
        address: "Govandi Slum, Ward 187, Mumbai, Maharashtra",
        scheduledDateTime: new Date('2024-07-05T10:00:00Z'),
        durationMinutes: 120,
        location: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // Mumbai coordinates
        },
        regionalData: {
            population: 6500,
            literacyRate: 75,
            primaryOccupation: "Informal sector",
            commonHealthIssues: ["Respiratory diseases", "Tuberculosis", "Malnutrition", "Mental health", "Substance abuse"],
            healthcareFacilities: ["Municipal dispensary - 3km", "Private clinics - Limited", "Mobile health units"],
            economicStatus: "Very Low",
            culturalFactors: ["Multi-ethnic population", "Migrant workers", "Language barriers"],
            environmentalFactors: ["Overcrowding", "Poor ventilation", "Sanitation issues", "Air pollution"],
            governmentSchemes: ["PM-JAY", "Urban Health Mission", "Slum Rehabilitation"],
            demographics: "Dense urban population, 80% migrants, 20% local residents",
            nutritionStatus: "Severe food insecurity, no cooking facilities, complete reliance on street food",
            healthTrends: "Very high respiratory issues, increasing mental health problems, rampant substance abuse",
            serviceGaps: "Extremely overcrowded facilities, very long waiting times, no mental health services",
            behavioralData: "Extreme stress levels, very irregular eating, no exercise, heavy substance abuse",
            educationLevels: "Very low literacy, no formal education, no vocational training",
            languageTechAccess: "Multiple languages, limited smartphone usage, basic social media"
        }
    },
    {
        name: "Mountain Community Health - Himachal Pradesh",
        address: "Kullu Valley, Village: Manali, Himachal Pradesh",
        scheduledDateTime: new Date('2024-08-15T08:30:00Z'),
        durationMinutes: 110,
        location: {
            type: 'Point',
            coordinates: [77.2090, 32.2432] // Manali coordinates
        },
        regionalData: {
            population: 2800,
            literacyRate: 88,
            primaryOccupation: "Tourism and agriculture",
            commonHealthIssues: ["Altitude sickness", "Respiratory problems", "Joint pain", "Mental health", "Substance abuse"],
            healthcareFacilities: ["District Hospital - 15km", "Private clinics", "Ayurvedic centers"],
            economicStatus: "Middle to High",
            culturalFactors: ["Tourist influence", "Traditional practices", "Modern lifestyle adoption"],
            environmentalFactors: ["High altitude", "Cold climate", "Tourist pollution", "Limited access"],
            governmentSchemes: ["Himachal Health Mission", "PM-JAY", "Tourism development"],
            demographics: "Mixed population, 60% locals, 40% migrant workers. Tourism-dependent economy",
            nutritionStatus: "Good access to local produce, seasonal variations, traditional mountain diet",
            healthTrends: "Altitude-related health issues, tourism-related stress, substance abuse among youth",
            serviceGaps: "Limited specialist care, seasonal access issues, emergency response challenges",
            behavioralData: "Tourism-driven lifestyle changes, stress from seasonal work, substance use",
            educationLevels: "Good literacy rates, tourism education, health awareness programs",
            languageTechAccess: "Hindi, English, local dialects, high technology adoption, social media active"
        }
    },
    {
        name: "Desert Region Health - Rajasthan",
        address: "Jaisalmer District, Village: Sam Sand Dunes, Rajasthan",
        scheduledDateTime: new Date('2024-09-20T07:00:00Z'),
        durationMinutes: 130,
        location: {
            type: 'Point',
            coordinates: [70.9022, 26.9157] // Jaisalmer coordinates
        },
        regionalData: {
            population: 1500,
            literacyRate: 55,
            primaryOccupation: "Agriculture and tourism",
            commonHealthIssues: ["Dehydration", "Heat stroke", "Malnutrition", "Water scarcity", "Respiratory problems"],
            healthcareFacilities: ["Primary Health Center - 20km", "Mobile medical units", "Traditional healers"],
            economicStatus: "Low to Middle",
            culturalFactors: ["Traditional desert lifestyle", "Gender segregation", "Conservative practices"],
            environmentalFactors: ["Extreme heat", "Water scarcity", "Dust storms", "Limited vegetation"],
            governmentSchemes: ["Rajasthan Health Mission", "PM-JAY", "Desert development"],
            demographics: "Desert community, 80% agricultural workers, 20% tourism workers. Traditional family structures",
            nutritionStatus: "Limited food variety, water-dependent diet, seasonal food shortages",
            healthTrends: "Heat-related illnesses, water-borne diseases, malnutrition in children",
            serviceGaps: "Geographic isolation, limited healthcare infrastructure, emergency response delays",
            behavioralData: "Traditional health practices, low health-seeking behavior, community-based decisions",
            educationLevels: "Low literacy rates, limited formal education, traditional knowledge systems",
            languageTechAccess: "Rajasthani, Hindi, limited technology access, radio and TV main channels"
        }
    },
    {
        name: "Northeast Tribal Health - Assam",
        address: "Kaziranga Region, Village: Kohora, Assam",
        scheduledDateTime: new Date('2024-10-10T09:00:00Z'),
        durationMinutes: 140,
        location: {
            type: 'Point',
            coordinates: [93.1737, 26.5731] // Kaziranga coordinates
        },
        regionalData: {
            population: 2200,
            literacyRate: 70,
            primaryOccupation: "Agriculture and conservation",
            commonHealthIssues: ["Malaria", "Dengue", "Malnutrition", "Maternal health", "Mental health"],
            healthcareFacilities: ["Community Health Center - 10km", "Mobile health units", "Traditional healers"],
            economicStatus: "Low to Middle",
            culturalFactors: ["Indigenous practices", "Multi-ethnic community", "Conservation awareness"],
            environmentalFactors: ["Forest environment", "Monsoon challenges", "Wildlife encounters", "Flooding"],
            governmentSchemes: ["Assam Health Mission", "PM-JAY", "Tribal welfare"],
            demographics: "Multi-ethnic tribal population, 70% agricultural workers, 30% conservation workers",
            nutritionStatus: "Forest-based diet, seasonal variations, traditional cooking methods",
            healthTrends: "Vector-borne diseases, improving maternal health, mental health awareness",
            serviceGaps: "Geographic challenges, limited specialist care, emergency response coordination",
            behavioralData: "Strong community bonds, traditional health practices, conservation mindset",
            educationLevels: "Moderate literacy, conservation education, health awareness growing",
            languageTechAccess: "Assamese, tribal languages, moderate technology adoption, community radio"
        }
    },
    {
        name: "Metropolitan Health Outreach - Delhi",
        address: "Nizamuddin Basti, New Delhi",
        scheduledDateTime: new Date('2024-11-05T10:30:00Z'),
        durationMinutes: 100,
        location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139] // Delhi coordinates
        },
        regionalData: {
            population: 8500,
            literacyRate: 85,
            primaryOccupation: "Service sector and informal work",
            commonHealthIssues: ["Air pollution effects", "Stress disorders", "Lifestyle diseases", "Mental health", "Substance abuse"],
            healthcareFacilities: ["Government hospitals", "Private clinics", "Mental health centers"],
            economicStatus: "Mixed (Low to High)",
            culturalFactors: ["Multi-cultural population", "Modern lifestyle", "Work pressure", "Social media influence"],
            environmentalFactors: ["Air pollution", "Noise pollution", "Overcrowding", "Traffic stress"],
            governmentSchemes: ["Delhi Health Mission", "PM-JAY", "Mental health programs"],
            demographics: "Diverse urban population, 60% migrants, 40% local residents. Mixed age groups",
            nutritionStatus: "Varied diet patterns, fast food consumption, irregular eating habits",
            healthTrends: "Rising lifestyle diseases, mental health concerns, pollution-related issues",
            serviceGaps: "Overcrowded facilities, long waiting times, mental health service gaps",
            behavioralData: "High stress levels, irregular schedules, social media addiction, substance use",
            educationLevels: "High literacy rates, good educational infrastructure, health awareness",
            languageTechAccess: "Multiple languages, high technology usage, digital communication platforms"
        }
    },
    {
        name: "Island Community Health - Andaman & Nicobar",
        address: "Port Blair, South Andaman Island",
        scheduledDateTime: new Date('2024-12-15T08:00:00Z'),
        durationMinutes: 120,
        location: {
            type: 'Point',
            coordinates: [92.7265, 11.6234] // Port Blair coordinates
        },
        regionalData: {
            population: 3200,
            literacyRate: 92,
            primaryOccupation: "Fishing and tourism",
            commonHealthIssues: ["Occupational injuries", "Mental health", "Substance abuse", "Hypertension", "Diabetes"],
            healthcareFacilities: ["GB Pant Hospital", "Private clinics", "Ayurvedic centers"],
            economicStatus: "Middle",
            culturalFactors: ["Island lifestyle", "Tourist influence", "Traditional practices", "Modern adoption"],
            environmentalFactors: ["Island climate", "Monsoon challenges", "Tourist pressure", "Limited resources"],
            governmentSchemes: ["Andaman Health Mission", "PM-JAY", "Island development"],
            demographics: "Island community, 50% fishermen, 30% tourism workers, 20% government employees",
            nutritionStatus: "Good access to fish, seasonal variations, tourist-influenced diet",
            healthTrends: "Lifestyle diseases increasing, mental health awareness growing, occupational hazards",
            serviceGaps: "Limited specialist care, emergency evacuation challenges, mental health services needed",
            behavioralData: "Island lifestyle stress, tourist season pressure, substance use for stress relief",
            educationLevels: "High literacy rates, good educational infrastructure, health education programs",
            languageTechAccess: "Hindi, English, local dialects, good technology adoption, social media active"
        }
    }
];

// Generate AI questions for each region
const generateAIQuestions = async (region) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a public health expert creating a survey for a health counselling session.
            
            Region Details:
            - Name: ${region.name}
            - Location: ${region.address}
            - Population: ${region.regionalData.population}
            - Primary Occupation: ${region.regionalData.primaryOccupation}
            - Common Health Issues: ${region.regionalData.commonHealthIssues.join(', ')}
            - Economic Status: ${region.regionalData.economicStatus}
            - Cultural Factors: ${region.regionalData.culturalFactors.join(', ')}
            - Environmental Factors: ${region.regionalData.environmentalFactors.join(', ')}
            
            Generate 15 relevant health survey questions for this specific region. Focus on:
            1. Nutrition and food security
            2. Water and sanitation
            3. Healthcare access and utilization
            4. Maternal and child health
            5. Occupational health (if applicable)
            6. Mental health and substance abuse
            7. Environmental health risks
            8. Cultural health practices
            9. Economic factors affecting health
            10. Government scheme awareness
            
            Return ONLY an array of 15 questions as JSON, no additional text.
            Example format: ["Question 1", "Question 2", ...]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Error generating AI questions:", error);
        // Fallback questions if AI fails
        return [
            "How many meals do you eat per day?",
            "Do you have access to clean drinking water?",
            "How often do you visit a healthcare facility?",
            "Are all family members vaccinated?",
            "Do you practice regular hand washing?",
            "How many hours of sleep do you get?",
            "Do you experience any chronic health issues?",
            "How do you dispose of waste?",
            "Do you have health insurance?",
            "How do you handle medical emergencies?",
            "Are there any mental health concerns in the family?",
            "How do you maintain personal hygiene?",
            "Do you consume tobacco or alcohol?",
            "How do you ensure food safety?",
            "What is your main source of income?"
        ];
    }
};

// Generate realistic family names based on region
const generateFamilyNames = (region) => {
    const names = {
        "Rural Health Initiative - Uttar Pradesh": [
            "Sharma", "Verma", "Yadav", "Singh", "Kumar", "Gupta", "Mishra", "Tiwari", "Chauhan", "Patel"
        ],
        "Urban Slum Health Program - Mumbai": [
            "Khan", "Patel", "Sharma", "Singh", "Kumar", "Gupta", "Joshi", "Desai", "Mehta", "Shah"
        ],
        "Tribal Health Outreach - Odisha": [
            "Munda", "Ho", "Santal", "Oraon", "Gond", "Kondh", "Saura", "Bonda", "Didayi", "Gadaba"
        ],
        "Coastal Community Health - Kerala": [
            "Nair", "Menon", "Pillai", "Kurup", "Nambiar", "Thampi", "Unni", "Warrier", "Panicker", "Kartha"
        ],
        "Industrial Worker Health - Gujarat": [
            "Patel", "Shah", "Desai", "Mehta", "Joshi", "Gandhi", "Modi", "Bhatt", "Dave", "Trivedi"
        ],
        "Rural Health Follow-up - Uttar Pradesh": [
            "Sharma", "Verma", "Yadav", "Singh", "Kumar", "Gupta", "Mishra", "Tiwari", "Chauhan", "Patel"
        ],
        "Urban Health Extension - Mumbai": [
            "Khan", "Patel", "Sharma", "Singh", "Kumar", "Gupta", "Joshi", "Desai", "Mehta", "Shah"
        ],
        "Mountain Community Health - Himachal Pradesh": [
            "Thakur", "Rana", "Negi", "Rawat", "Bisht", "Kandari", "Panwar", "Chauhan", "Singh", "Sharma"
        ],
        "Desert Region Health - Rajasthan": [
            "Rathore", "Chauhan", "Sisodia", "Kachhwaha", "Shekhawat", "Bhati", "Tanwar", "Gahlot", "Mertiya", "Devda"
        ],
        "Northeast Tribal Health - Assam": [
            "Bodo", "Mishing", "Karbi", "Dimasa", "Rabha", "Tiwa", "Deori", "Sonowal", "Gogoi", "Saikia"
        ],
        "Metropolitan Health Outreach - Delhi": [
            "Kumar", "Singh", "Sharma", "Verma", "Gupta", "Malhotra", "Kapoor", "Khanna", "Chopra", "Mehra"
        ],
        "Island Community Health - Andaman & Nicobar": [
            "Lakshmanan", "Kumar", "Singh", "Pillai", "Nair", "Menon", "Kurup", "Thampi", "Unni", "Warrier"
        ]
    };
    
    return names[region.name] || ["Sharma", "Verma", "Singh", "Kumar", "Gupta"];
};

// Generate household data with realistic family members
const generateHouseholds = (sessionId, counsellorId, region, regionIndex) => {
    const households = [];
    const familyNames = generateFamilyNames(region);
    
    // Generate exactly 10 households per region
    for (let i = 0; i < 10; i++) {
        const familyName = familyNames[i % familyNames.length];
        const memberCount = 3 + Math.floor(Math.random() * 3); // 3-5 members minimum
        const members = [];
        
        // Generate family members with realistic relationships
        for (let j = 0; j < memberCount; j++) {
            let name, age, gender;
            
            if (j === 0) {
                // Head of family
                age = 35 + Math.floor(Math.random() * 25); // 35-60
                gender = Math.random() > 0.3 ? 'Male' : 'Female'; // Mostly male heads
                name = `${gender === 'Male' ? 'Mr.' : 'Mrs.'} ${familyName}`;
            } else if (j === 1) {
                // Spouse
                age = 30 + Math.floor(Math.random() * 20); // 30-50
                gender = members[0].gender === 'Male' ? 'Female' : 'Male';
                name = `${gender === 'Male' ? 'Mr.' : 'Mrs.'} ${familyName}`;
            } else {
                // Children or other family members
                if (Math.random() > 0.5) {
                    // Child
                    age = 1 + Math.floor(Math.random() * 17); // 1-18
                    gender = Math.random() > 0.5 ? 'Male' : 'Female';
                    name = `${gender === 'Male' ? 'Master' : 'Miss'} ${familyName}`;
                } else {
                    // Elder or other relative
                    age = 60 + Math.floor(Math.random() * 20); // 60-80
                    gender = Math.random() > 0.5 ? 'Male' : 'Female';
                    name = `${gender === 'Male' ? 'Mr.' : 'Mrs.'} ${familyName}`;
                }
            }
            
            // Health status based on age and region
            if (age < 18) {
                healthStatus = ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)];
            } else if (age > 60) {
                healthStatus = ['Fair', 'Poor'][Math.floor(Math.random() * 2)];
            } else {
                healthStatus = ['Good', 'Fair'][Math.floor(Math.random() * 2)];
            }
            
            members.push({ 
                name, 
                age, 
                gender, 
                phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
            });
        }
        
        households.push({
            name: `${familyName} Family`,
            address: `${region.address} - ${familyName} Family (Household ${i + 1})`,
            members: members,
            counsellingSession: sessionId,
            counsellor: counsellorId,
            healthAnalysis: {
                keyRiskFactors: generateRiskFactors(region),
                positiveIndicators: generatePositiveIndicators(region),
                counsellingFocus: generateCounsellingFocus(region)
            }
        });
    }
    
    return households;
};

// Generate risk factors based on region
const generateRiskFactors = (region) => {
    const regionSpecificRisks = {
        "Rural Health Initiative - Uttar Pradesh": ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
        "Urban Slum Health Program - Mumbai": ["Respiratory diseases", "Tuberculosis", "Overcrowding", "Substance abuse"],
        "Tribal Health Outreach - Odisha": ["Malaria", "Malnutrition", "Maternal mortality", "Geographic isolation"],
        "Coastal Community Health - Kerala": ["Occupational injuries", "Mental health", "Alcoholism", "Hypertension"],
        "Industrial Worker Health - Gujarat": ["Occupational diseases", "Respiratory problems", "Stress disorders", "Chemical exposure"],
        "Rural Health Follow-up - Uttar Pradesh": ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
        "Urban Health Extension - Mumbai": ["Respiratory diseases", "Tuberculosis", "Overcrowding", "Substance abuse"],
        "Mountain Community Health - Himachal Pradesh": ["Altitude sickness", "Respiratory problems", "Joint pain", "Mental health"],
        "Desert Region Health - Rajasthan": ["Dehydration", "Heat stroke", "Malnutrition", "Water scarcity"],
        "Northeast Tribal Health - Assam": ["Malaria", "Dengue", "Malnutrition", "Maternal health"],
        "Metropolitan Health Outreach - Delhi": ["Air pollution effects", "Stress disorders", "Lifestyle diseases", "Mental health"],
        "Island Community Health - Andaman & Nicobar": ["Occupational injuries", "Mental health", "Substance abuse", "Hypertension"]
    };
    
    const risks = regionSpecificRisks[region.name] || ["Malnutrition", "Poor sanitation", "Water-borne diseases"];
    return risks.slice(0, 2 + Math.floor(Math.random() * 3)); // 2-4 risk factors
};

// Generate positive indicators
const generatePositiveIndicators = (region) => {
    const indicators = [
        "Good family support", "Regular health checkups", "Balanced diet",
        "Physical activity", "Hygiene practices", "Vaccination compliance",
        "Traditional medicine knowledge", "Community support", "Health awareness"
    ];
    
    return indicators.slice(0, 2 + Math.floor(Math.random() * 3)); // 2-4 indicators
};

// Generate counselling focus areas
const generateCounsellingFocus = (region) => {
    const focusAreas = [
        "Nutrition education", "Hygiene practices", "Family planning",
        "Disease prevention", "Mental health support", "Occupational safety",
        "Maternal care", "Child development", "Elderly care", "Substance abuse prevention"
    ];
    
    return focusAreas.slice(0, 2 + Math.floor(Math.random() * 3)); // 2-4 focus areas
};

// Generate survey responses based on AI questions
const generateSurveyResponses = (householdId, sessionId, questions, region) => {
    const responses = [];
    
    // Generate 10-15 responses per household (based on questions)
    const responseCount = Math.min(questions.length, 10 + Math.floor(Math.random() * 6));
    
    for (let i = 0; i < responseCount; i++) {
        const question = questions[i];
        const answer = generateContextualAnswer(question, region);
        
        responses.push({
            household: householdId,
            counsellingSession: sessionId,
            question: question,
            answer: answer,
            heatmapData: {
                riskLevel: determineRiskLevel(question, answer),
                category: determineCategory(question),
                priority: 1 + Math.floor(Math.random() * 5),
                tags: generateTags(question, answer, region)
            }
        });
    }
    
    return responses;
};

// Generate contextual answers based on region and question
const generateContextualAnswer = (question, region) => {
    const regionSpecificAnswers = {
        "Rural Health Initiative - Uttar Pradesh": {
            "How many meals do you eat per day?": ["2 meals", "3 meals", "1 meal", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["Sometimes", "No, we use untreated water", "Yes, always", "We buy bottled water"],
            "What is your main source of income?": ["Agriculture", "Daily wage", "Small business", "Government job"],
            "How do you dispose of waste?": ["Open dumping", "Burning", "Municipal collection", "Composting"]
        },
        "Urban Slum Health Program - Mumbai": {
            "How many meals do you eat per day?": ["2 meals", "1 meal", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["Sometimes", "We buy bottled water", "Yes, always", "No, we use untreated water"],
            "What is your main source of income?": ["Daily wage", "Informal sector", "Small business", "Factory work"],
            "How do you dispose of waste?": ["Municipal collection", "Open dumping", "Burning", "Recycling"]
        },
        "Tribal Health Outreach - Odisha": {
            "How many meals do you eat per day?": ["1 meal", "2 meals", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["No, we use untreated water", "Sometimes", "Yes, always", "We collect from river"],
            "What is your main source of income?": ["Forest-based work", "Agriculture", "Daily wage", "Traditional crafts"],
            "How do you dispose of waste?": ["Open dumping", "Burning", "Natural decomposition", "Municipal collection"]
        },
        "Coastal Community Health - Kerala": {
            "How many meals do you eat per day?": ["3 meals", "2 meals", "More than 3 meals", "1 meal"],
            "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "We buy bottled water", "No, we use untreated water"],
            "What is your main source of income?": ["Fishing", "Tourism", "Daily wage", "Business"],
            "How do you dispose of waste?": ["Municipal collection", "Recycling", "Burning", "Open dumping"]
        },
        "Industrial Worker Health - Gujarat": {
            "How many meals do you eat per day?": ["3 meals", "2 meals", "More than 3 meals", "1 meal"],
            "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "We buy bottled water", "No, we use untreated water"],
            "What is your main source of income?": ["Industrial work", "Factory job", "Business", "Salaried job"],
            "How do you dispose of waste?": ["Municipal collection", "Recycling", "Burning", "Open dumping"]
        },
        "Rural Health Follow-up - Uttar Pradesh": {
            "How many meals do you eat per day?": ["1 meal", "2 meals", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["No, we use untreated water", "Sometimes", "Yes, always", "We buy bottled water"],
            "What is your main source of income?": ["Agriculture", "Daily wage", "Small business", "Government job"],
            "How do you dispose of waste?": ["Open dumping", "Burning", "Municipal collection", "Composting"]
        },
        "Urban Health Extension - Mumbai": {
            "How many meals do you eat per day?": ["1 meal", "2 meals", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["Sometimes", "We buy bottled water", "Yes, always", "No, we use untreated water"],
            "What is your main source of income?": ["Daily wage", "Informal sector", "Small business", "Factory work"],
            "How do you dispose of waste?": ["Municipal collection", "Open dumping", "Burning", "Recycling"]
        },
        "Mountain Community Health - Himachal Pradesh": {
            "How many meals do you eat per day?": ["3 meals", "2 meals", "More than 3 meals", "1 meal"],
            "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "We buy bottled water", "No, we use untreated water"],
            "What is your main source of income?": ["Tourism", "Agriculture", "Daily wage", "Government job"],
            "How do you dispose of waste?": ["Municipal collection", "Recycling", "Burning", "Open dumping"]
        },
        "Desert Region Health - Rajasthan": {
            "How many meals do you eat per day?": ["2 meals", "1 meal", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["Sometimes", "No, we use untreated water", "Yes, always", "We buy bottled water"],
            "What is your main source of income?": ["Agriculture", "Tourism", "Daily wage", "Small business"],
            "How do you dispose of waste?": ["Open dumping", "Burning", "Municipal collection", "Natural decomposition"]
        },
        "Northeast Tribal Health - Assam": {
            "How many meals do you eat per day?": ["2 meals", "1 meal", "3 meals", "More than 3 meals"],
            "Do you have access to clean drinking water?": ["Sometimes", "No, we use untreated water", "Yes, always", "We collect from river"],
            "What is your main source of income?": ["Agriculture", "Forest-based work", "Daily wage", "Conservation work"],
            "How do you dispose of waste?": ["Open dumping", "Burning", "Natural decomposition", "Municipal collection"]
        },
        "Metropolitan Health Outreach - Delhi": {
            "How many meals do you eat per day?": ["3 meals", "2 meals", "More than 3 meals", "1 meal"],
            "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "We buy bottled water", "No, we use untreated water"],
            "What is your main source of income?": ["Service sector", "Informal work", "Business", "Salaried job"],
            "How do you dispose of waste?": ["Municipal collection", "Recycling", "Burning", "Open dumping"]
        },
        "Island Community Health - Andaman & Nicobar": {
            "How many meals do you eat per day?": ["3 meals", "2 meals", "More than 3 meals", "1 meal"],
            "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "We buy bottled water", "No, we use untreated water"],
            "What is your main source of income?": ["Fishing", "Tourism", "Government job", "Small business"],
            "How do you dispose of waste?": ["Municipal collection", "Recycling", "Burning", "Open dumping"]
        }
    };
    
    const regionAnswers = regionSpecificAnswers[region.name] || {};
    const specificAnswers = regionAnswers[question];
    
    if (specificAnswers) {
        return specificAnswers[Math.floor(Math.random() * specificAnswers.length)];
    }
    
    // Generic answers for other questions
    const genericAnswers = {
        "How often do you visit a healthcare facility?": ["Only in emergencies", "Once a year", "Regularly for checkups", "Never"],
        "Are all family members vaccinated?": ["Most are", "Some are", "Yes, all", "None are vaccinated"],
        "Do you practice regular hand washing?": ["Sometimes", "Always", "Rarely", "Never"],
        "How many hours of sleep do you get?": ["5-7 hours", "7-9 hours", "Less than 5 hours", "More than 9 hours"],
        "Do you experience any chronic health issues?": ["No", "Yes, one issue", "Yes, multiple issues", "Not sure"],
        "Do you have health insurance?": ["No", "Yes", "Don't know", "Planning to get"],
        "How do you handle medical emergencies?": ["Go to hospital", "Call ambulance", "Home remedies", "Traditional medicine"],
        "Are there any mental health concerns in the family?": ["No", "Yes, stress", "Yes, depression", "Yes, other issues"],
        "How do you maintain personal hygiene?": ["Daily bathing", "Regular washing", "Sometimes", "Rarely"],
        "Do you consume tobacco or alcohol?": ["No", "Occasionally", "Regularly", "Heavily"],
        "How do you ensure food safety?": ["Proper cooking", "Clean storage", "Fresh ingredients", "Don't know"]
    };
    
    return genericAnswers[question] ? 
        genericAnswers[question][Math.floor(Math.random() * genericAnswers[question].length)] : 
        ["Yes", "No", "Sometimes", "Don't know"][Math.floor(Math.random() * 4)];
};

// Determine risk level based on question and answer
const determineRiskLevel = (question, answer) => {
    const highRiskAnswers = {
        "How many meals do you eat per day?": ["1 meal"],
        "Do you have access to clean drinking water?": ["No, we use untreated water"],
        "Are all family members vaccinated?": ["None are vaccinated"],
        "Do you practice regular hand washing?": ["Never", "Rarely"],
        "How many hours of sleep do you get?": ["Less than 5 hours"],
        "Do you experience any chronic health issues?": ["Yes, multiple issues"],
        "How do you dispose of waste?": ["Open dumping"],
        "Do you have health insurance?": ["No"],
        "Are there any mental health concerns in the family?": ["Yes, depression"],
        "Do you consume tobacco or alcohol?": ["Heavily"]
    };
    
    const mediumRiskAnswers = {
        "How many meals do you eat per day?": ["2 meals"],
        "Do you have access to clean drinking water?": ["Sometimes"],
        "Are all family members vaccinated?": ["Some are"],
        "Do you practice regular hand washing?": ["Sometimes"],
        "How many hours of sleep do you get?": ["5-7 hours"],
        "Do you experience any chronic health issues?": ["Yes, one issue"],
        "How do you dispose of waste?": ["Burning"],
        "Do you have health insurance?": ["Don't know"],
        "Are there any mental health concerns in the family?": ["Yes, stress"],
        "Do you consume tobacco or alcohol?": ["Regularly"]
    };
    
    if (highRiskAnswers[question]?.includes(answer)) return 'high';
    if (mediumRiskAnswers[question]?.includes(answer)) return 'medium';
    return 'low';
};

// Determine category for the question
const determineCategory = (question) => {
    if (question.includes('meal') || question.includes('food')) return 'nutrition';
    if (question.includes('water')) return 'sanitation';
    if (question.includes('healthcare') || question.includes('vaccine')) return 'healthcare';
    if (question.includes('hygiene') || question.includes('hand')) return 'hygiene';
    if (question.includes('sleep')) return 'lifestyle';
    if (question.includes('mental')) return 'mental_health';
    if (question.includes('tobacco') || question.includes('alcohol')) return 'substance_abuse';
    if (question.includes('income')) return 'economic';
    return 'general';
};

// Generate tags for the response
const generateTags = (question, answer, region) => {
    const tags = [];
    
    if (question.includes('meal') && answer.includes('1')) tags.push('malnutrition');
    if (question.includes('water') && answer.includes('untreated')) tags.push('water-borne');
    if (question.includes('vaccine') && answer.includes('None')) tags.push('immunization');
    if (question.includes('hygiene') && answer.includes('Never')) tags.push('sanitation');
    if (question.includes('mental') && answer.includes('depression')) tags.push('mental-health');
    if (question.includes('alcohol') && answer.includes('Heavily')) tags.push('substance-abuse');
    
    // Add region-specific tags
    if (region.name.includes('Rural')) tags.push('rural-health');
    if (region.name.includes('Urban')) tags.push('urban-health');
    if (region.name.includes('Tribal')) tags.push('tribal-health');
    if (region.name.includes('Coastal')) tags.push('coastal-health');
    if (region.name.includes('Industrial')) tags.push('occupational-health');
    if (region.name.includes('Mountain')) tags.push('mountain-health');
    if (region.name.includes('Desert')) tags.push('desert-health');
    if (region.name.includes('Northeast')) tags.push('northeast-health');
    if (region.name.includes('Metropolitan')) tags.push('metropolitan-health');
    if (region.name.includes('Island')) tags.push('island-health');
    
    return tags;
};

// Main seeding function
const seedData = async () => {
    try {
        console.log('🚀 Starting comprehensive data seeding...');
        console.log('📋 Following workflow: Admin → Sessions → AI Questions → Households → Family Members → Survey Responses');
        
        // Clear existing data
        await CounsellingSession.deleteMany({});
        await Household.deleteMany({});
        await SurveyResponse.deleteMany({});
        
        // Get or create an admin
        let admin = await Admin.findOne();
        if (!admin) {
            admin = await Admin.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'admin123'
            });
            console.log('✅ Created admin user');
        }
        
        // Get or create counsellors
        let counsellors = await Counsellor.find();
        if (counsellors.length === 0) {
            counsellors = await Counsellor.insertMany([
                {
                    name: 'Dr. Priya Sharma',
                    email: 'priya.sharma@health.org',
                    phone: '+91-9876543210',
                    specialization: 'Community Health',
                    status: 'Approved'
                },
                {
                    name: 'Dr. Rajesh Kumar',
                    email: 'rajesh.kumar@health.org',
                    phone: '+91-9876543211',
                    specialization: 'Public Health',
                    status: 'Approved'
                },
                {
                    name: 'Dr. Meera Patel',
                    email: 'meera.patel@health.org',
                    phone: '+91-9876543212',
                    specialization: 'Maternal Health',
                    status: 'Approved'
                }
            ]);
            console.log('✅ Created 3 counsellors');
        }
        
        // Create sessions and households for each region
        const allRegions = [...exampleRegions, ...additionalSessions];
        
        for (let i = 0; i < allRegions.length; i++) {
            const region = allRegions[i];
            const counsellor = counsellors[i % counsellors.length];
            
            console.log(`\n📍 Processing Region ${i + 1}: ${region.name}`);
            
            // Step 1: Admin creates session
            const session = await CounsellingSession.create({
                name: region.name,
                address: region.address,
                scheduledDateTime: region.scheduledDateTime,
                durationMinutes: region.durationMinutes,
                location: region.location,
                regionalData: region.regionalData,
                createdBy: admin._id,
                assignedCounsellor: counsellor._id,
                status: 'Completed'
            });
            
            console.log(`✅ Admin created session: ${session.name}`);
            
            // Step 2: Generate AI questions for this session
            console.log('🤖 Generating AI questions for this region...');
            const aiQuestions = await generateAIQuestions(region);
            console.log(`✅ Generated ${aiQuestions.length} AI questions`);
            
            // Step 3: Counsellor adds households with family members
            console.log('👨‍👩‍👧‍👦 Counsellor adding households and family members...');
            const households = generateHouseholds(session._id, counsellor._id, region, i);
            
            for (let j = 0; j < households.length; j++) {
                const householdData = households[j];
                const household = await Household.create(householdData);
                console.log(`✅ Created household ${j + 1}/10: ${householdData.members.length} family members`);
                
                // Step 4: Submit survey responses based on AI questions
                console.log(`📝 Submitting survey responses for household ${j + 1}...`);
                const responses = generateSurveyResponses(household._id, session._id, aiQuestions, region);
                await SurveyResponse.insertMany(responses);
                console.log(`✅ Submitted ${responses.length} survey responses`);
            }
            
            console.log(`🎉 Completed region ${i + 1}: ${households.length} households, ${households.reduce((sum, h) => sum + h.members.length, 0)} family members`);
        }
        
        console.log('\n🎊 Data seeding completed successfully!');
        
        // Print comprehensive summary
        const sessionCount = await CounsellingSession.countDocuments();
        const householdCount = await Household.countDocuments();
        const responseCount = await SurveyResponse.countDocuments();
        const counsellorCount = await Counsellor.countDocuments();
        
        console.log('\n📊 === COMPREHENSIVE SEEDING SUMMARY ===');
        console.log(`🏥 Sessions Created: ${sessionCount} (12 regions across 12 months)`);
        console.log(`🏠 Households Created: ${householdCount} (10 per region)`);
        console.log(`👨‍👩‍👧‍👦 Total Family Members: ${householdCount * 4} (avg 4 per household)`);
        console.log(`📝 Survey Responses: ${responseCount} (10-15 per household)`);
        console.log(`👨‍⚕️ Counsellors: ${counsellorCount}`);
        console.log('==========================================');
        
        console.log('\n🎯 Workflow Summary:');
        console.log('1. ✅ Admin created 12 sessions with regional data (Jan-Dec 2024)');
        console.log('2. ✅ AI generated contextual questions for each region');
        console.log('3. ✅ Counsellors added 10 households per session');
        console.log('4. ✅ Each household has 3-5 family members');
        console.log('5. ✅ Survey responses submitted based on AI questions');
        console.log('6. ✅ Health analysis generated for each household');
        console.log('7. ✅ Data spread across 12 months for better analytics');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

// Run the seeding
seedData();