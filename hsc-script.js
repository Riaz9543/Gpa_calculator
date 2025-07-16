// HSC Group Subjects Configuration
const hscSubjects = {
  science: [
    { id: 'physics', name: 'Physics', required: true },
    { id: 'chemistry', name: 'Chemistry', required: true },
    { id: 'mathematics', name: 'Mathematics', required: true },
    { id: 'biology', name: 'Biology', required: false },
    { id: 'higher-math', name: 'Higher Mathematics', required: false }
  ],
  business: [
    { id: 'accounting', name: 'Accounting', required: true },
    { id: 'management', name: 'Management', required: true },
    { id: 'economics', name: 'Economics', required: true },
    { id: 'finance-banking', name: 'Finance & Banking', required: false },
    { id: 'business-org', name: 'Business Organization & Management', required: false }
  ],
  humanities: [
    { id: 'logic', name: 'Logic', required: true },
    { id: 'psychology', name: 'Psychology', required: false },
    { id: 'history', name: 'History', required: false },
    { id: 'islamic-history', name: 'Islamic History & Culture', required: false },
    { id: 'social-work', name: 'Social Work', required: false },
    { id: 'sociology', name: 'Sociology', required: false }
  ]
};

// Grade to GPA mapping
const gradePoints = {
  '5': 5.00,
  '4': 4.00,
  '3.5': 3.50,
  '3.25': 3.25,
  '3': 3.00,
  '2.75': 2.75,
  '2.5': 2.50,
  '2.25': 2.25,
  '2': 2.00,
  '0': 0.00
};

// Grade to letter mapping
const gradeLetters = {
  '5': 'A+',
  '4': 'A',
  '3.5': 'A-',
  '3.25': 'B+',
  '3': 'B',
  '2.75': 'B-',
  '2.5': 'C+',
  '2.25': 'C',
  '2': 'D',
  '0': 'F'
};

let selectedGroup = null;

// Show subjects based on selected group
function showSubjects(group) {
  selectedGroup = group;
  const subjectsDiv = document.getElementById('subjects');
  const form = document.getElementById('gpaForm');
  const resultDiv = document.getElementById('result');
  
  // Clear previous content
  subjectsDiv.innerHTML = '';
  resultDiv.innerHTML = '';
  resultDiv.style.display = 'none';

  // Highlight selected group
  document.querySelectorAll('.group-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`.group-card.${group}`).classList.add('selected');
  
  // Show form with animation
  form.style.display = 'block';
  
  // Generate group subjects
  const subjects = hscSubjects[group];
  if (subjects) {
    subjects.forEach((subject, index) => {
      const delay = index * 0.1;
      const requiredText = subject.required ? ' (Required)' : ' (Optional)';
      
      subjectsDiv.innerHTML += `
        <div class="subject" style="animation-delay: ${delay}s">
          <label for="${subject.id}">${subject.name}${requiredText}:</label>
          <select class="grade group-subject${subject.required ? ' required' : ''}" 
                  id="${subject.id}" 
                  data-required="${subject.required}"
                  aria-label="${subject.name} Grade">
            <option value="">--Grade--</option>
            <option value="5">A+ (5.00)</option>
            <option value="4">A (4.00)</option>
            <option value="3.5">A- (3.50)</option>
            <option value="3.25">B+ (3.25)</option>
            <option value="3">B (3.00)</option>
            <option value="2.75">B- (2.75)</option>
            <option value="2.5">C+ (2.50)</option>
            <option value="2.25">C (2.25)</option>
            <option value="2">D (2.00)</option>
            <option value="0">F (0.00)</option>
          </select>
        </div>
      `;
    });
  }

  // Add event listeners for real-time validation
  addValidationListeners();
  
  // Scroll to form smoothly
  setTimeout(() => {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

// Add real-time validation listeners
function addValidationListeners() {
  const selects = document.querySelectorAll('#gpaForm select');
  selects.forEach(select => {
    select.addEventListener('change', function() {
      validateSelect(this);
    });
  });
}

// Validate individual select element
function validateSelect(select) {
  const value = select.value;
  if (value && value !== '') {
    select.classList.add('input-success');
    select.classList.remove('input-error');
  } else {
    select.classList.remove('input-success');
    if (select.classList.contains('required') || select.classList.contains('compulsory')) {
      select.classList.add('input-error');
    }
  }
}

// Calculate HSC GPA
function calculateHSCGPA() {
  if (!selectedGroup) {
    showResult('Please select a group first!', 'error');
    return;
  }

  // Get all grades
  const compulsoryGrades = getCompulsoryGrades();
  const groupGrades = getGroupGrades();
  const optionalGrades = getOptionalGrades();

  // Validate compulsory subjects
  const compulsoryValidation = validateCompulsorySubjects(compulsoryGrades);
  if (!compulsoryValidation.isValid) {
    showResult(compulsoryValidation.message, 'error');
    return;
  }

  // Validate group subjects
  const groupValidation = validateGroupSubjects(groupGrades);
  if (!groupValidation.isValid) {
    showResult(groupValidation.message, 'error');
    return;
  }

  // Calculate GPA
  const gpaResult = calculateGPA(compulsoryGrades, groupGrades, optionalGrades);
  
  // Display result
  displayResult(gpaResult);
}

// Get compulsory subject grades
function getCompulsoryGrades() {
  const bangla = document.getElementById('bangla').value;
  const english = document.getElementById('english').value;
  const ict = document.getElementById('ict').value;
  
  return { bangla, english, ict };
}

// Get group subject grades
function getGroupGrades() {
  const grades = {};
  const subjects = hscSubjects[selectedGroup];
  
  subjects.forEach(subject => {
    const element = document.getElementById(subject.id);
    if (element) {
      grades[subject.id] = {
        value: element.value,
        required: subject.required,
        name: subject.name
      };
    }
  });
  
  return grades;
}

// Get optional subject grades
function getOptionalGrades() {
  const optional1 = document.getElementById('optional1').value;
  const optional2 = document.getElementById('optional2').value;
  
  return { optional1, optional2 };
}

// Validate compulsory subjects
function validateCompulsorySubjects(grades) {
  const subjects = ['bangla', 'english', 'ict'];
  const missing = [];
  const failed = [];

  subjects.forEach(subject => {
    if (!grades[subject] || grades[subject] === '') {
      missing.push(subject.charAt(0).toUpperCase() + subject.slice(1));
    } else if (parseFloat(grades[subject]) === 0) {
      failed.push(subject.charAt(0).toUpperCase() + subject.slice(1));
    }
  });

  if (missing.length > 0) {
    return {
      isValid: false,
      message: `Please enter grades for: ${missing.join(', ')}`
    };
  }

  if (failed.length > 0) {
    return {
      isValid: false,
      message: `Failed in compulsory subject(s): ${failed.join(', ')}. GPA = 0.00`
    };
  }

  return { isValid: true };
}

// Validate group subjects
function validateGroupSubjects(grades) {
  const requiredSubjects = [];
  const passedSubjects = [];
  const failedSubjects = [];

  Object.keys(grades).forEach(key => {
    const grade = grades[key];
    if (grade.required) {
      requiredSubjects.push(grade.name);
      if (!grade.value || grade.value === '') {
        // Required subject not filled
      } else if (parseFloat(grade.value) === 0) {
        failedSubjects.push(grade.name);
      } else {
        passedSubjects.push(grade.name);
      }
    } else if (grade.value && grade.value !== '' && parseFloat(grade.value) > 0) {
      passedSubjects.push(grade.name);
    }
  });

  // Check if at least 3 subjects are passed (including required ones)
  if (passedSubjects.length < 3) {
    return {
      isValid: false,
      message: `You must pass at least 3 group subjects. Currently passed: ${passedSubjects.length}`
    };
  }

  if (failedSubjects.length > 0) {
    return {
      isValid: false,
      message: `Failed in group subject(s): ${failedSubjects.join(', ')}. GPA = 0.00`
    };
  }

  return { isValid: true };
}

// Calculate final GPA
function calculateGPA(compulsoryGrades, groupGrades, optionalGrades) {
  let totalPoints = 0;
  let totalSubjects = 0;
  let subjectDetails = [];

  // Add compulsory subjects
  ['bangla', 'english', 'ict'].forEach(subject => {
    if (compulsoryGrades[subject] && compulsoryGrades[subject] !== '') {
      const points = parseFloat(compulsoryGrades[subject]);
      totalPoints += points;
      totalSubjects++;
      subjectDetails.push({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        grade: gradeLetters[compulsoryGrades[subject]],
        points: points,
        type: 'compulsory'
      });
    }
  });

  // Add group subjects (best scores, minimum 3)
  const groupScores = [];
  Object.keys(groupGrades).forEach(key => {
    const grade = groupGrades[key];
    if (grade.value && grade.value !== '' && parseFloat(grade.value) > 0) {
      groupScores.push({
        name: grade.name,
        points: parseFloat(grade.value),
        grade: gradeLetters[grade.value],
        required: grade.required
      });
    }
  });

  // Sort group subjects by points (highest first) but ensure required subjects are included
  const requiredGroupSubjects = groupScores.filter(s => s.required);
  const optionalGroupSubjects = groupScores.filter(s => !s.required);
  optionalGroupSubjects.sort((a, b) => b.points - a.points);

  // Take required subjects plus best optional subjects to make at least 3 total
  let selectedGroupSubjects = [...requiredGroupSubjects];
  let remainingSlots = Math.max(0, 3 - requiredGroupSubjects.length);
  selectedGroupSubjects.push(...optionalGroupSubjects.slice(0, remainingSlots));

  // Add selected group subjects to calculation
  selectedGroupSubjects.forEach(subject => {
    totalPoints += subject.points;
    totalSubjects++;
    subjectDetails.push({
      name: subject.name,
      grade: subject.grade,
      points: subject.points,
      type: 'group'
    });
  });

  // Add optional subjects (only if they improve GPA)
  let optionalBonus = 0;
  let optionalCount = 0;
  ['optional1', 'optional2'].forEach((opt, index) => {
    if (optionalGrades[opt] && optionalGrades[opt] !== '') {
      const points = parseFloat(optionalGrades[opt]);
      if (points > 2.0) { // Only if grade is above D
        optionalBonus += Math.min(points - 2.0, 1.0); // Max 1 point bonus per subject
        optionalCount++;
        subjectDetails.push({
          name: `Optional Subject ${index + 1}`,
          grade: gradeLetters[optionalGrades[opt]],
          points: points,
          type: 'optional',
          bonus: Math.min(points - 2.0, 1.0)
        });
      }
    }
  });

  // Calculate base GPA
  let gpa = totalSubjects > 0 ? totalPoints / totalSubjects : 0;
  
  // Add optional bonus (max 1.0 total bonus)
  gpa += Math.min(optionalBonus, 1.0);
  
  // Cap at 5.00
  gpa = Math.min(gpa, 5.0);

  return {
    gpa: gpa,
    totalSubjects: totalSubjects,
    optionalBonus: Math.min(optionalBonus, 1.0),
    subjectDetails: subjectDetails
  };
}

// Display calculation result
function displayResult(result) {
  const resultDiv = document.getElementById('result');
  const gpa = result.gpa.toFixed(2);
  let gradeClass = 'result-success';
  let message = '';
  
  // Determine grade and message
  if (gpa >= 5.0) {
    message = 'Excellent! Golden A+';
    gradeClass = 'result-success';
  } else if (gpa >= 4.0) {
    message = 'Great performance!';
    gradeClass = 'result-success';
  } else if (gpa >= 3.5) {
    message = 'Good job!';
    gradeClass = 'result-success';
  } else if (gpa >= 2.0) {
    message = 'You passed!';
    gradeClass = 'result-warning';
  } else {
    message = 'Need improvement';
    gradeClass = 'result-danger';
  }

  let detailsHTML = '<div class="subject-breakdown">';
  result.subjectDetails.forEach(subject => {
    let typeLabel = '';
    if (subject.type === 'compulsory') typeLabel = '(Compulsory)';
    else if (subject.type === 'group') typeLabel = '(Group)';
    else if (subject.type === 'optional') typeLabel = `(Optional${subject.bonus ? ` +${subject.bonus.toFixed(2)} bonus` : ''})`;
    
    detailsHTML += `
      <div class="subject-detail">
        <span class="subject-name">${subject.name} ${typeLabel}</span>
        <span class="subject-grade">${subject.grade} (${subject.points.toFixed(2)})</span>
      </div>
    `;
  });
  detailsHTML += '</div>';

  const bonusText = result.optionalBonus > 0 ? 
    `<p class="bonus-info">📈 Optional Subject Bonus: +${result.optionalBonus.toFixed(2)}</p>` : '';

  resultDiv.innerHTML = `
    <div class="${gradeClass}">
      <h2>Your HSC GPA Result</h2>
      <div class="gpa-display">${gpa}</div>
      <div class="gpa-grade">${message}</div>
      ${bonusText}
      <p class="calculation-summary">
        📊 Based on ${result.totalSubjects} subjects in ${selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)} group
      </p>
      ${detailsHTML}
      <button onclick="resetCalculator()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--text-secondary); color: white; border: none; border-radius: 8px; cursor: pointer;">
        Calculate Again
      </button>
    </div>
  `;
  
  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show error or info messages
function showResult(message, type) {
  const resultDiv = document.getElementById('result');
  const className = type === 'error' ? 'result-danger' : 'result-warning';
  
  resultDiv.innerHTML = `
    <div class="${className}">
      <h3>${type === 'error' ? '❌ Error' : '⚠️ Warning'}</h3>
      <p>${message}</p>
    </div>
  `;
  
  resultDiv.style.display = 'block';
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset calculator
function resetCalculator() {
  // Reset form
  document.getElementById('gpaForm').reset();
  
  // Remove validation classes
  document.querySelectorAll('.input-success, .input-error').forEach(el => {
    el.classList.remove('input-success', 'input-error');
  });
  
  // Hide result
  document.getElementById('result').style.display = 'none';
  
  // Scroll to top
  document.querySelector('.group-select').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add keyboard navigation support
document.addEventListener('DOMContentLoaded', function() {
  // Add keyboard support for group cards
  document.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add Enter key support for calculate button
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && selectedGroup) {
      const form = document.getElementById('gpaForm');
      if (form.style.display !== 'none') {
        calculateHSCGPA();
      }
    }
  });

  // Add loading animation for calculations
  const originalCalculate = window.calculateHSCGPA;
  window.calculateHSCGPA = function() {
    const button = document.querySelector('button[onclick="calculateHSCGPA()"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<span class="loading"></span> Calculating...';
    button.disabled = true;
    
    setTimeout(() => {
      originalCalculate();
      button.innerHTML = originalText;
      button.disabled = false;
    }, 500);
  };
});

// Add CSS for subject breakdown
const style = document.createElement('style');
style.textContent = `
  .subject-breakdown {
    margin-top: 1.5rem;
    text-align: left;
    background: #f8fafc;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .subject-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .subject-detail:last-child {
    border-bottom: none;
  }
  
  .subject-name {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .subject-grade {
    font-weight: bold;
    color: var(--primary-color);
  }
  
  .bonus-info {
    color: var(--success-color);
    font-weight: 500;
    margin: 0.5rem 0;
  }
  
  .calculation-summary {
    margin: 1rem 0;
    color: var(--text-secondary);
    font-style: italic;
  }
`;
document.head.appendChild(style);