const subjectList = {
  science: [
    "Bangla (1st + 2nd)",
    "English (1st + 2nd)", 
    "Mathematics",
    "Bangladesh & Global Studies",
    "Physics",
    "Chemistry", 
    "Biology",
    "Religion"
  ],
  humanities: [
    "Bangla (1st + 2nd)",
    "English (1st + 2nd)",
    "Mathematics", 
    "Social Science",
    "Civics",
    "Economics/History",
    "General Science",
    "Religion"
  ],
  commerce: [
    "Bangla (1st + 2nd)",
    "English (1st + 2nd)",
    "Mathematics",
    "Bangladesh & Global Studies", 
    "Accounting",
    "Business Entrepreneurship",
    "Finance & Banking",
    "Religion"
  ]
};

// Grade to point mapping
const gradePoints = {
  "A+": 5.00,
  "A": 4.00,
  "A-": 3.50,
  "B": 3.00,
  "C": 2.00,
  "D": 1.00,
  "F": 0.00
};

// Current selected group
let currentGroup = '';

// Show subjects based on selected group
function showSubjects(group) {
  const subjectsDiv = document.getElementById('subjects');
  const form = document.getElementById('gpaForm');
  const resultDiv = document.getElementById('result');
  
  currentGroup = group;
  subjectsDiv.innerHTML = '';
  resultDiv.style.display = 'none';

  if (group) {
    // Highlight selected group
    document.querySelectorAll('.group-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`.group-card.${group}`).classList.add('selected');
    
    // Show form
    form.style.display = 'block';
    
    // Create subjects HTML
    let subjectsHTML = '';
    subjectList[group].forEach((subject, index) => {
      const delay = index * 0.05;
      const subjectId = subject.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      subjectsHTML += `
        <div class="subject" style="animation-delay: ${delay}s">
          <label for="${subjectId}">${subject}:</label>
          <select class="grade main-subject" id="${subjectId}" data-subject="${subject}" aria-label="${subject} Grade">
            <option value="">--Select Grade--</option>
            <option value="5">A+ (5.00)</option>
            <option value="4">A (4.00)</option>
            <option value="3.5">A- (3.50)</option>
            <option value="3">B (3.00)</option>
            <option value="2">C (2.00)</option>
            <option value="1">D (1.00)</option>
            <option value="0">F (0.00)</option>
          </select>
        </div>
      `;
    });

    subjectsDiv.innerHTML = subjectsHTML;

    // Scroll to form with a delay to ensure animation starts
    setTimeout(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    form.style.display = 'none';
  }
}

function calculateGPA() {
  const mainSubjects = document.querySelectorAll('.main-subject');
  const ictGrade = parseFloat(document.getElementById('ict').value);
  const optionalGrade = parseFloat(document.getElementById('optional').value);
  
  // Collect main subject grades
  const grades = [];
  let hasEmptyGrade = false;
  let hasFailGrade = false;
  
  mainSubjects.forEach(select => {
    const value = select.value;
    if (value === '') {
      hasEmptyGrade = true;
      return;
    }
    const grade = parseFloat(value);
    grades.push(grade);
    if (grade === 0) {
      hasFailGrade = true;
    }
  });

  // Validation checks
  if (hasEmptyGrade) {
    showResult('⚠️ Please select grades for all main subjects', 'error');
    return;
  }

  if (!ictGrade && ictGrade !== 0) {
    showResult('⚠️ Please select grade for ICT subject', 'error');
    return;
  }

  // Check for failures
  if (hasFailGrade || ictGrade === 0) {
    showResult('📊 GPA: 0.00 (F) - Failed', 'fail');
    return;
  }

  // Calculate GPA
  let totalPoints = grades.reduce((sum, grade) => sum + grade, 0) + ictGrade;
  let mainSubjectCount = grades.length + 1; // Including ICT

  // Handle optional subject bonus
  let optionalBonus = 0;
  let optionalDisplay = '';
  
  if (optionalGrade && optionalGrade > 0) {
    if (optionalGrade === 0) {
      showResult('📊 GPA: 0.00 (F) - Failed in Optional Subject', 'fail');
      return;
    }
    
    if (optionalGrade > 2.0) {
      optionalBonus = optionalGrade - 2.0;
      optionalDisplay = ` (Bonus: +${optionalBonus.toFixed(2)} from Optional)`;
    }
  }

  // Calculate final GPA
  let finalGPA = (totalPoints + optionalBonus) / mainSubjectCount;
  
  // Cap at maximum 5.00
  if (finalGPA > 5.00) {
    finalGPA = 5.00;
  }

  // Determine letter grade
  let letterGrade = getLetterGrade(finalGPA);
  
  // Get traditional division equivalent  
  let division = getDivision(finalGPA);

  // Display comprehensive result
  showResult(
    `🎯 <strong>Final GPA: ${finalGPA.toFixed(2)} (${letterGrade})</strong><br>
    📈 Division Equivalent: ${division}<br>
    📚 Group: ${currentGroup.charAt(0).toUpperCase() + currentGroup.slice(1)}<br>
    📝 Main Subjects: ${mainSubjectCount} subjects calculated${optionalDisplay}`, 
    'success'
  );
}

function getLetterGrade(gpa) {
  if (gpa >= 5.00) return "A+";
  if (gpa >= 4.00) return "A";
  if (gpa >= 3.50) return "A-";
  if (gpa >= 3.00) return "B";
  if (gpa >= 2.00) return "C";
  if (gpa >= 1.00) return "D";
  return "F";
}

function getDivision(gpa) {
  if (gpa >= 5.00) return "1st Division (Star Marks)";
  if (gpa >= 4.00) return "1st Division";
  if (gpa >= 3.50) return "1st Division";
  if (gpa >= 3.00) return "2nd Division";
  if (gpa >= 2.00) return "2nd Division";
  if (gpa >= 1.00) return "3rd Division";
  return "Fail";
}

function showResult(message, type) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = message;
  resultDiv.className = '';
  resultDiv.classList.add(type);
  resultDiv.style.display = 'block';
  
  // Add animation and scroll to result
  resultDiv.style.animation = 'none';
  setTimeout(() => {
    resultDiv.style.animation = 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 10);
}

// Reset calculator
function resetCalculator() {
  const form = document.getElementById('gpaForm');
  const resultDiv = document.getElementById('result');
  
  // Reset all select elements
  document.querySelectorAll('select').forEach(select => {
    select.value = '';
  });
  
  // Hide result
  resultDiv.style.display = 'none';
  
  // Remove group selections
  document.querySelectorAll('.group-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Hide form
  form.style.display = 'none';
  
  currentGroup = '';
}

// Keyboard navigation and shortcuts
document.addEventListener('DOMContentLoaded', () => {
  // Add keyboard navigation for grade selections
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.classList.contains('grade')) {
      const inputs = Array.from(document.querySelectorAll('.grade'));
      const currentIndex = inputs.indexOf(document.activeElement);
      
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else {
        calculateGPA();
      }
    }
    
    // ESC to reset
    if (e.key === 'Escape') {
      resetCalculator();
    }
    
    // Ctrl+Enter to calculate
    if (e.ctrlKey && e.key === 'Enter') {
      calculateGPA();
    }
  });
  
  // Auto-save functionality (optional)
  const saveState = () => {
    const state = {
      group: currentGroup,
      grades: {}
    };
    
    document.querySelectorAll('select').forEach(select => {
      if (select.value) {
        state.grades[select.id] = select.value;
      }
    });
    
    localStorage.setItem('sscGpaCalculatorState', JSON.stringify(state));
  };
  
  // Load saved state
  const loadState = () => {
    const saved = localStorage.getItem('sscGpaCalculatorState');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.group) {
          setTimeout(() => {
            showSubjects(state.group);
            setTimeout(() => {
              Object.entries(state.grades).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                  element.value = value;
                }
              });
            }, 100);
          }, 100);
        }
      } catch (e) {
        console.log('Could not load saved state');
      }
    }
  };
  
  // Save state on change
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('grade')) {
      saveState();
    }
  });
  
  // Load state on page load
  loadState();
});

// Add helpful tooltips and guidance
function showGradeInfo() {
  const infoHTML = `
    <div class="grade-info">
      <h3>📊 SSC Grading System</h3>
      <table>
        <tr><th>Marks Range</th><th>Grade</th><th>Points</th></tr>
        <tr><td>80-100</td><td>A+</td><td>5.00</td></tr>
        <tr><td>70-79</td><td>A</td><td>4.00</td></tr>
        <tr><td>60-69</td><td>A-</td><td>3.50</td></tr>
        <tr><td>50-59</td><td>B</td><td>3.00</td></tr>
        <tr><td>40-49</td><td>C</td><td>2.00</td></tr>
        <tr><td>33-39</td><td>D</td><td>1.00</td></tr>
        <tr><td>0-32</td><td>F</td><td>0.00</td></tr>
      </table>
      <p><strong>💡 Tips:</strong></p>
      <ul>
        <li>ICT is mandatory for GPA calculation</li>
        <li>Optional subject adds bonus if grade > 2.0</li>
        <li>Any F grade results in overall failure</li>
        <li>Maximum GPA is capped at 5.00</li>
      </ul>
    </div>
  `;
  
  showResult(infoHTML, 'info');
}