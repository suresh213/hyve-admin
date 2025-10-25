# Bulk Upload Templates

This directory contains CSV templates for bulk uploading data into the Aadarsh Pariksha Kendra admin panel.

## Available Templates

### 1. Riders Bulk Upload (`riders_bulk_upload.csv`)

**Required Fields:**
- `firstName` - First name of the rider
- `contact` - Mobile number (10 digits)
- `username` - Unique username for login
- `password` - Password for the rider account

**Optional Fields:**
- `lastName` - Last name of the rider
- `email` - Email address
- `vehicleNumber` - Vehicle registration number
- `drivingLicenseNumber` - Driving license number
- `zone` - Zone assignment (North Zone, South Zone, East Zone, West Zone)
- `photoUrl` - URL to profile photo (leave empty for manual upload)

**Example:**
```csv
firstName,lastName,contact,username,password,email,vehicleNumber,drivingLicenseNumber,zone,photoUrl
John,Doe,9876543210,johndoe,password123,john@example.com,MH12AB1234,DL1234567890,North Zone,
```

### 2. Addresses Bulk Upload (`addresses_bulk_upload.csv`)

**Required Fields:**
- `code` - Unique address code
- `name` - Location name
- `address` - Full address
- `city` - City name
- `state` - State name
- `pinCode` - 6-digit PIN code

**Optional Fields:**
- `zone` - Zone assignment
- `description` - Additional description
- `lat` - Latitude coordinates
- `lng` - Longitude coordinates
- `spoc1Name` - Primary contact person name
- `spoc1Contact` - Primary contact person phone
- `spoc2Name` - Secondary contact person name
- `spoc2Contact` - Secondary contact person phone

**Example:**
```csv
code,name,address,city,state,pinCode,zone,description,lat,lng,spoc1Name,spoc1Contact,spoc2Name,spoc2Contact
LOC001,Central Office,123 Main Street,Mumbai,Maharashtra,400001,West Zone,Main corporate office,19.0760,72.8777,John Manager,9876543210,Jane Supervisor,9876543211
```

### 3. Trips Bulk Upload (`trips_bulk_upload.csv`)

**Required Fields:**
- `addressCode` - Address code (must exist in addresses)
- `scheduleDate` - Trip date (YYYY-MM-DD format)
- `assignedTo` - Username of assigned rider

**Optional Fields:**
- `examCode` - Examination code
- `examDate` - Examination date (YYYY-MM-DD format)
- `startTime` - Start time (HH:MM format)
- `endTime` - End time (HH:MM format)
- `zoneId` - Zone identifier
- `coordinatorName` - Coordinator name
- `coordinatorContact` - Coordinator contact number

**Example:**
```csv
examCode,examDate,addressCode,scheduleDate,startTime,endTime,zoneId,assignedTo,coordinatorName,coordinatorContact
EXAM001,2024-01-15,LOC001,2024-01-15,09:00,17:00,ZONE1,johndoe,John Coordinator,9876543210
```

## File Format Guidelines

### Supported Formats
- CSV (`.csv`) - Recommended
- Excel (`.xlsx`, `.xls`)

### File Size Limits
- Maximum file size: 10MB
- Recommended batch size: 1000 records or less for optimal performance

### Data Validation Rules

#### General Rules
- All required fields must be filled
- Empty optional fields should be left blank (not null/undefined)
- No special characters in IDs/codes except hyphens and underscores
- Dates must be in YYYY-MM-DD format
- Times must be in HH:MM format (24-hour)

#### Specific Validations
- **Contact numbers**: Must be 10 digits
- **Email addresses**: Must be valid email format
- **PIN codes**: Must be exactly 6 digits
- **Usernames**: Must be unique, 3-50 characters, alphanumeric
- **Passwords**: Minimum 6 characters
- **Coordinates**: Valid latitude (-90 to 90) and longitude (-180 to 180)

## Error Handling

### Common Upload Errors
1. **Duplicate entries**: Check for duplicate usernames, codes, or contact numbers
2. **Invalid data format**: Ensure dates, times, and numbers follow the specified format
3. **Missing required fields**: All required columns must have values
4. **File size too large**: Split large files into smaller batches
5. **Invalid references**: Ensure addressCode and assignedTo references exist

### Best Practices
1. **Test with small batches** first (5-10 records)
2. **Keep backups** of your data before uploading
3. **Validate data** manually before bulk upload
4. **Use consistent formatting** across all records
5. **Check for duplicates** in your source data

## Support

If you encounter issues with bulk uploads:
1. Download and check the sample templates
2. Verify your data against the validation rules
3. Test with a smaller batch first
4. Contact support if problems persist

## Template Updates

These templates are updated based on the latest API requirements. Always download the latest version before preparing your bulk upload files. 