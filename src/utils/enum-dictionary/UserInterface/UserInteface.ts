export interface UserInterface  {
        fullname: string;
        email?: string;
        password: string;
        mobileno: string;
        emergencyContact?: string;
        age?: number;
        gender?: "Male" | "Female" | "Other";
        bloodgroup?: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-" | "Unknown";
        medicalHistory?: string;
        currentMedications?: string[];
        bloodPressure?: string;
        alcoholConsumption?: "Yes" | "No";
        address?: string;
        createdAt?: Date; 
        updatedAt?: Date
        state ?:any,
        role ?: 'admin' | 'user',
        [key:string]:any,
}