# Doctor Assistant - Complete Testing Guide

## Overview
This guide provides step-by-step prompts to test the complete diagnostic workflow, including:
- First visit (new patient)
- Second visit (returning patient with history comparison)
- Full workflow from intake to report generation

---

## Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:5173`
- Database initialized (run migration if needed)

---

## TEST 1: First Visit (New Patient)

### Step 1: Login & Start Diagnostic
1. Login to the application
2. Click "Start Diagnostic" or navigate to Diagnostic page
3. Wait for initial greeting message

### Step 2: Patient Intake
**Type this prompt:**
```
name hassan age 21 weight 60kg gender male smoker yes symptoms chest pain for last four days and minor breathing issue no fever medical history dust allergy occupation student
```

**Expected Response:**
- System extracts all information
- Shows confirmation message with your details
- Asks: "Please review your information and confirm if it's correct..."

**Type:**
```
Yes, that is correct
```

### Step 3: Clinical Assessment & Test Recommendations
**Expected Response:**
- Clinical assessment message
- Recommends tests: X-ray, Spirometry, CBC
- Asks which test to provide first

### Step 4: Provide Spirometry Test
**Type:**
```
show me spirometry form
```

**Expected Response:**
- Spirometry form modal appears
- Fill in the form:
  - FEV1: `5`
  - FVC: `5`
- Click "Submit"

**Expected Response:**
- "Thank you for providing the Spirometry. Next, I need your X-ray image..."

### Step 5: Provide X-ray Test
- Click "Upload X-ray" button
- Upload an X-ray image (or use test image)
- Wait for analysis

**Expected Response:**
- "X-ray analysis result: [Disease] (confidence: XX%)"
- "Next, I recommend providing your CBC (Blood Test) results..."

### Step 6: Skip CBC Test
**Type:**
```
skip cbc test
```

**Expected Response:**
- "Thank you for providing the X-ray (skipped). Next, I recommend providing your CBC (Blood Test) results..."
- Or moves directly to diagnosis if all tests handled

### Step 7: Treatment Plan (RAG)
**Expected Response:**
- Diagnosis message appears
- Treatment plan with medications
- Home remedies
- Follow-up instructions
- Asks: "Do you approve this plan? If you have questions about the medicines, feel free to ask."

**Type:**
```
approve this plan
```

### Step 8: Report Generation & History Save
**Expected Response:**
- "Processing your approval and generating the final report..."
- Final comprehensive report appears
- Shows calculated dosages
- Visit saved to database
- Visit ID displayed

**Check Dashboard:**
- Test results displayed (X-ray, Spirometry)
- Treatment plan visible
- Diagnosis shown
- PDF report available for download

---

## TEST 2: Second Visit (Returning Patient - Progress Comparison)

### Step 1: Login & Start New Diagnostic
1. Login (same user account)
2. Click "Start Diagnostic" again
3. Wait for initial greeting

### Step 2: Patient Intake (Returning Patient)
**Type this prompt:**
```
name hassan age 21 weight 60kg gender male non smoker symptoms chest pain for last three days and minor breathing issue no fever medical history dust allergy occupation student
```

**Expected Response:**
- System may recognize returning patient
- Shows confirmation with updated information
- Note: Weight might be same, but smoker status changed to "No"

**Type:**
```
Yes, that is correct
```

### Step 3: Clinical Assessment
**Expected Response:**
- Clinical assessment message
- Test recommendations (X-ray, Spirometry, CBC)

### Step 4: Provide All Tests
**For Spirometry:**
```
show me spirometry form
```
- Fill: FEV1: `6`, FVC: `6`
- Submit

**For X-ray:**
- Upload X-ray image
- Wait for analysis

**For CBC:**
```
show me cbc form
```
- Fill in CBC form with values
- Submit

### Step 5: Treatment Plan
**Expected Response:**
- Diagnosis appears
- Treatment plan
- **IMPORTANT:** Should show progress comparison if previous visit exists

**Type:**
```
approve this plan
```

### Step 6: Final Report with Progress Analysis
**Expected Response:**
- Final report generated
- **Progress Analysis section** should appear (comparing with previous visit)
- Shows improvement/changes
- Visit saved with new Visit ID

**Check:**
- Dashboard shows both visits
- Progress comparison visible
- PDF reports available for both visits

---

## TEST 3: Quick Test (Minimal Input)

### Step 1: Start Diagnostic
- Login and start

### Step 2: Minimal Patient Info
**Type:**
```
name ali age 25 symptoms cough and fever for 2 days
```

**Type:**
```
yes
```

### Step 3: Skip All Tests
**Type:**
```
skip
```

**Type:**
```
skip
```

**Type:**
```
skip
```

### Step 4: Approve Treatment
- Wait for treatment plan
- Type: `approve`

**Expected:**
- Report generated even with minimal data
- Visit saved

---

## TEST 4: Emergency Detection

### Step 1: Start Diagnostic

### Step 2: Emergency Symptoms
**Type:**
```
name test age 30 symptoms severe chest pain unable to breathe gasping for air severe shortness of breath
```

**Expected Response:**
- Emergency detection should trigger
- Shows emergency message
- Recommends immediate medical attention
- May end workflow early

---

## TEST 5: Form Testing

### Test Spirometry Form
**Type:**
```
show me spirometry form
```
- Fill form and submit
- Verify result appears in dashboard

### Test CBC Form
**Type:**
```
show me cbc form
```
- Fill form and submit
- Verify result appears in dashboard

### Test X-ray Upload
- Click upload button
- Upload image
- Verify analysis appears

---

## Verification Checklist

After completing tests, verify:

- [ ] Patient intake works correctly
- [ ] All three test forms work (Spirometry, CBC, X-ray)
- [ ] Test results appear in dashboard
- [ ] Treatment plan is generated
- [ ] Approval workflow works
- [ ] Final report is generated
- [ ] PDF report is downloadable
- [ ] Visit is saved to database
- [ ] Second visit shows progress comparison
- [ ] History is accessible
- [ ] All data persists between sessions

---

## Common Issues & Solutions

### Issue: "No such column: pdf_report_path"
**Solution:** Run migration:
```bash
cd backend && python run_migration.py
```

### Issue: CORS Error
**Solution:** Check backend is running on port 8000 and CORS is configured

### Issue: Tests not showing in dashboard
**Solution:** Check browser console for errors, verify state is being updated

### Issue: Treatment plan not appearing
**Solution:** Ensure all tests are completed or skipped before RAG runs

---

## Video Recording Tips

1. **Start with login screen** - Show authentication
2. **Show first visit** - Complete workflow from start to finish
3. **Show dashboard** - Display test results, treatment plan
4. **Show second visit** - Demonstrate returning patient with history
5. **Show progress comparison** - Highlight the comparison feature
6. **Show PDF download** - Demonstrate report download
7. **Show patient history** - Navigate to history page

---

## Expected Video Flow

1. **0:00-0:30** - Login and start diagnostic
2. **0:30-1:00** - Patient intake (type info, confirm)
3. **1:00-2:00** - Provide tests (Spirometry form, X-ray upload, skip CBC)
4. **2:00-2:30** - Treatment plan appears, approve
5. **2:30-3:00** - Final report generated, show dashboard
6. **3:00-4:00** - Start second visit, show returning patient greeting
7. **4:00-5:00** - Complete second visit, show progress comparison
8. **5:00-5:30** - Show patient history, PDF download

**Total: ~5-6 minutes**

---

## Notes

- Speak clearly while typing prompts
- Explain what you're doing at each step
- Highlight key features (forms, ML predictions, progress comparison)
- Show error handling if any errors occur
- Demonstrate the complete workflow smoothly

---

## Quick Reference: All Prompts

### First Visit:
```
name hassan age 21 weight 60kg gender male smoker yes symptoms chest pain for last four days and minor breathing issue no fever medical history dust allergy occupation student
```
```
Yes, that is correct
```
```
show me spirometry form
```
[Fill form: FEV1=5, FVC=5, Submit]
[Upload X-ray]
```
skip cbc test
```
```
approve this plan
```

### Second Visit:
```
name hassan age 21 weight 60kg gender male non smoker symptoms chest pain for last three days and minor breathing issue no fever medical history dust allergy occupation student
```
```
Yes, that is correct
```
```
show me spirometry form
```
[Fill form: FEV1=6, FVC=6, Submit]
[Upload X-ray]
```
show me cbc form
```
[Fill CBC form, Submit]
```
approve this plan
```

---

**Good luck with your video! 🎥**
