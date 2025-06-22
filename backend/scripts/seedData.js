const mongoose = require('mongoose');
const CounsellingSession = require('../models/CounsellingSession');
const Counsellor = require('../models/Counsellor');
const Household = require('../models/Household');
const SurveyResponse = require('../models/SurveyResponse');
const Admin = require('../models/Admin');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Example Regions with detailed data
const exampleRegions = [
    {
        name: "Rural Health Initiative - Uttar Pradesh",
        address: "Village: Ramnagar, District: Varanasi, Uttar Pradesh",
        scheduledDateTime: new Date('2024-01-15T09:00:00Z'),
        regionalData: {
            population: 2500,
            literacyRate: 65,
            primaryOccupation: "Agriculture",
            commonHealthIssues: ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
            healthcareFacilities: ["Primary Health Center - 5km away", "Community Health Worker - Available"],
            economicStatus: "Low to Middle",
            culturalFactors: ["Traditional medicine practices", "Gender-based health disparities", "Large family sizes"],
            environmentalFactors: ["Open defecation", "Contaminated water sources", "Poor sanitation"],
            governmentSchemes: ["Ayushman Bharat", "PM-JAY", "National Health Mission"]
        }
    },
    {
        name: "Urban Slum Health Program - Mumbai",
        address: "Dharavi Slum, Ward 185, Mumbai, Maharashtra",
        scheduledDateTime: new Date('2024-01-20T10:00:00Z'),
        regionalData: {
            population: 8500,
            literacyRate: 78,
            primaryOccupation: "Informal sector",
            commonHealthIssues: ["Respiratory diseases", "Tuberculosis", "Malnutrition", "Mental health", "Substance abuse"],
            healthcareFacilities: ["Municipal dispensary - 2km", "Private clinics - Available", "Mobile health units"],
            economicStatus: "Low",
            culturalFactors: ["Multi-ethnic population", "Migrant workers", "Language barriers"],
            environmentalFactors: ["Overcrowding", "Poor ventilation", "Sanitation issues", "Air pollution"],
            governmentSchemes: ["PM-JAY", "Urban Health Mission", "Slum Rehabilitation"]
        }
    },
    {
        name: "Tribal Health Outreach - Odisha",
        address: "Koraput District, Tribal Village Cluster, Odisha",
        scheduledDateTime: new Date('2024-01-25T08:00:00Z'),
        regionalData: {
            population: 1800,
            literacyRate: 45,
            primaryOccupation: "Forest-based livelihoods",
            commonHealthIssues: ["Malaria", "Malnutrition", "Maternal mortality", "Child mortality", "Sickle cell anemia"],
            healthcareFacilities: ["Mobile medical units", "ASHA workers", "Traditional healers"],
            economicStatus: "Very Low",
            culturalFactors: ["Indigenous healing practices", "Language barriers", "Geographic isolation"],
            environmentalFactors: ["Forest environment", "Seasonal access issues", "Wildlife encounters"],
            governmentSchemes: ["Tribal Health Plan", "National Health Mission", "PM-JAY"]
        }
    },
    {
        name: "Coastal Community Health - Kerala",
        address: "Fishing Village: Chellanam, Ernakulam District, Kerala",
        scheduledDateTime: new Date('2024-01-30T09:30:00Z'),
        regionalData: {
            population: 3200,
            literacyRate: 95,
            primaryOccupation: "Fishing and tourism",
            commonHealthIssues: ["Occupational injuries", "Skin diseases", "Mental health", "Alcoholism", "Hypertension"],
            healthcareFacilities: ["Community Health Center - 3km", "Private hospitals", "Ayurvedic centers"],
            economicStatus: "Middle",
            culturalFactors: ["High literacy", "Healthcare awareness", "Traditional medicine"],
            environmentalFactors: ["Coastal climate", "Monsoon challenges", "Sea-related hazards"],
            governmentSchemes: ["Kerala Health Mission", "PM-JAY", "Fisheries welfare schemes"]
        }
    },
    {
        name: "Industrial Worker Health - Gujarat",
        address: "Industrial Area: Vapi, Valsad District, Gujarat",
        scheduledDateTime: new Date('2024-02-05T08:00:00Z'),
        regionalData: {
            population: 12000,
            literacyRate: 82,
            primaryOccupation: "Industrial work",
            commonHealthIssues: ["Occupational diseases", "Respiratory problems", "Stress disorders", "Reproductive health", "Cancer risks"],
            healthcareFacilities: ["ESIC hospitals", "Private clinics", "Occupational health centers"],
            economicStatus: "Middle to High",
            culturalFactors: ["Migrant workers", "Nuclear families", "Work-life imbalance"],
            environmentalFactors: ["Industrial pollution", "Chemical exposure", "Noise pollution"],
            governmentSchemes: ["ESIC", "PM-JAY", "Industrial health regulations"]
        }
    }
];

// Example Households for each region
const generateHouseholds = (sessionId, counsellorId, regionIndex) => {
    const households = [];
    const region = exampleRegions[regionIndex];
    
    // Generate 8-12 households per region
    const householdCount = 8 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < householdCount; i++) {
        const memberCount = 3 + Math.floor(Math.random() * 5); // 3-7 members
        const members = [];
        
        for (let j = 0; j < memberCount; j++) {
            const age = 1 + Math.floor(Math.random() * 70);
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            
            let relationship = 'Other';
            if (j === 0) relationship = 'Head of Family';
            else if (j === 1) relationship = 'Spouse';
            else if (age < 18) relationship = 'Child';
            else if (age > 60) relationship = 'Elder';
            else relationship = ['Son', 'Daughter', 'Brother', 'Sister'][Math.floor(Math.random() * 4)];
            
            members.push({
                name: `Member ${j + 1}`,
                age: age,
                gender: gender,
                relationship: relationship,
                healthStatus: ['Good', 'Fair', 'Poor'][Math.floor(Math.random() * 3)]
            });
        }
        
        households.push({
            address: `${region.address} - Household ${i + 1}`,
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
    const allRisks = [
        "Malnutrition", "Poor sanitation", "Water-borne diseases", "Respiratory issues",
        "Maternal health risks", "Child immunization gaps", "Mental health concerns",
        "Substance abuse", "Occupational hazards", "Environmental pollution",
        "Genetic disorders", "Lifestyle diseases", "Infectious diseases"
    ];
    
    const regionSpecificRisks = {
        "Rural Health Initiative - Uttar Pradesh": ["Malnutrition", "Water-borne diseases", "Maternal health", "Child immunization"],
        "Urban Slum Health Program - Mumbai": ["Respiratory diseases", "Tuberculosis", "Overcrowding", "Substance abuse"],
        "Tribal Health Outreach - Odisha": ["Malaria", "Malnutrition", "Maternal mortality", "Geographic isolation"],
        "Coastal Community Health - Kerala": ["Occupational injuries", "Mental health", "Alcoholism", "Hypertension"],
        "Industrial Worker Health - Gujarat": ["Occupational diseases", "Respiratory problems", "Stress disorders", "Chemical exposure"]
    };
    
    const risks = regionSpecificRisks[region.name] || allRisks;
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

// Generate survey responses for each household
const generateSurveyResponses = (householdId, sessionId, region) => {
    const responses = [];
    
    // Common health survey questions
    const questions = [
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
    
    // Generate 10-15 responses per household
    const responseCount = 10 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < responseCount; i++) {
        const question = questions[i % questions.length];
        const answer = generateAnswer(question, region);
        
        responses.push({
            household: householdId,
            counsellingSession: sessionId,
            question: question,
            answer: answer,
            heatmapData: {
                riskLevel: determineRiskLevel(question, answer),
                category: determineCategory(question),
                priority: 1 + Math.floor(Math.random() * 5),
                tags: generateTags(question, answer)
            }
        });
    }
    
    return responses;
};

// Generate contextual answers based on region
const generateAnswer = (question, region) => {
    const answers = {
        "How many meals do you eat per day?": ["1 meal", "2 meals", "3 meals", "More than 3 meals"],
        "Do you have access to clean drinking water?": ["Yes, always", "Sometimes", "No, we use untreated water", "We buy bottled water"],
        "How often do you visit a healthcare facility?": ["Never", "Only in emergencies", "Once a year", "Regularly for checkups"],
        "Are all family members vaccinated?": ["Yes, all", "Most are", "Some are", "None are vaccinated"],
        "Do you practice regular hand washing?": ["Always", "Sometimes", "Rarely", "Never"],
        "How many hours of sleep do you get?": ["Less than 5 hours", "5-7 hours", "7-9 hours", "More than 9 hours"],
        "Do you experience any chronic health issues?": ["No", "Yes, one issue", "Yes, multiple issues", "Not sure"],
        "How do you dispose of waste?": ["Municipal collection", "Burning", "Open dumping", "Composting"],
        "Do you have health insurance?": ["Yes", "No", "Don't know", "Planning to get"],
        "How do you handle medical emergencies?": ["Go to hospital", "Call ambulance", "Home remedies", "Traditional medicine"],
        "Are there any mental health concerns in the family?": ["No", "Yes, stress", "Yes, depression", "Yes, other issues"],
        "How do you maintain personal hygiene?": ["Daily bathing", "Regular washing", "Sometimes", "Rarely"],
        "Do you consume tobacco or alcohol?": ["No", "Occasionally", "Regularly", "Heavily"],
        "How do you ensure food safety?": ["Proper cooking", "Clean storage", "Fresh ingredients", "Don't know"],
        "What is your main source of income?": ["Agriculture", "Daily wage", "Business", "Salaried job", "Fishing", "Industrial work"]
    };
    
    const possibleAnswers = answers[question] || ["Yes", "No", "Sometimes", "Don't know"];
    return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
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
const generateTags = (question, answer) => {
    const tags = [];
    
    if (question.includes('meal') && answer.includes('1')) tags.push('malnutrition');
    if (question.includes('water') && answer.includes('untreated')) tags.push('water-borne');
    if (question.includes('vaccine') && answer.includes('None')) tags.push('immunization');
    if (question.includes('hygiene') && answer.includes('Never')) tags.push('sanitation');
    if (question.includes('mental') && answer.includes('depression')) tags.push('mental-health');
    if (question.includes('alcohol') && answer.includes('Heavily')) tags.push('substance-abuse');
    
    return tags;
};

// Main seeding function
const seedData = async () => {
    try {
        console.log('Starting data seeding...');
        
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
        }
        
        // Get or create a counsellor
        let counsellor = await Counsellor.findOne();
        if (!counsellor) {
            counsellor = await Counsellor.create({
                name: 'Dr. Priya Sharma',
                email: 'priya.sharma@health.org',
                phone: '+91-9876543210',
                specialization: 'Community Health',
                status: 'Approved'
            });
        }
        
        // Create sessions and households for each region
        for (let i = 0; i < exampleRegions.length; i++) {
            const region = exampleRegions[i];
            
            // Create session
            const session = await CounsellingSession.create({
                name: region.name,
                address: region.address,
                scheduledDateTime: region.scheduledDateTime,
                regionalData: region.regionalData,
                createdBy: admin._id,
                assignedCounsellor: counsellor._id,
                status: 'Completed'
            });
            
            console.log(`Created session: ${session.name}`);
            
            // Generate households for this session
            const households = generateHouseholds(session._id, counsellor._id, i);
            
            for (const householdData of households) {
                const household = await Household.create(householdData);
                console.log(`Created household: ${household.address}`);
                
                // Generate survey responses for this household
                const responses = generateSurveyResponses(household._id, session._id, region);
                await SurveyResponse.insertMany(responses);
                console.log(`Created ${responses.length} survey responses for household`);
            }
        }
        
        console.log('Data seeding completed successfully!');
        console.log(`Created ${exampleRegions.length} sessions`);
        
        // Print summary
        const sessionCount = await CounsellingSession.countDocuments();
        const householdCount = await Household.countDocuments();
        const responseCount = await SurveyResponse.countDocuments();
        
        console.log('\n=== SEEDING SUMMARY ===');
        console.log(`Sessions: ${sessionCount}`);
        console.log(`Households: ${householdCount}`);
        console.log(`Survey Responses: ${responseCount}`);
        console.log('======================');
        
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeding
seedData(); 