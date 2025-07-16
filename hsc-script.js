const hscSubjectList = {
  science: [
    "Physics",
    "Chemistry", 
    "Mathematics",
    "Biology",
    "Higher Mathematics"
  ],
  business: [
    "Accounting",
    "Management",
    "Economics",
    "Finance & Banking",
    "Production Management & Marketing"
  ],
  humanities: [
    "Logic",
    "Psychology",
    "History",
    "Islamic History",
    "Social Work",
    "Philosophy",
    "Geography"
  ]
};

// Show subjects based on selected HSC group
function showSubjects(group) {
  const subjectsDiv = document.getElementById('subjects');
  const form = document.getElementById('gpaForm');
  const resultDiv = document.getElementById('result');
  
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
    
    // Add animation delay for each subject
    hscSubjectList[group].forEach((subject, index) => {
      const delay = index * 0.05;
      const subjectId = subject.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      subjectsDiv.innerHTML += `
        <div class="subject" style="animation-delay: ${delay}s">
          <label for="${subjectId}">${subject}:</label>
          <select class="grade group-subject" id="${subjectId}" aria-label="${subject} Grade">
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

    // Scroll to form
    setTimeout(() => {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    form.style.display = 'none';
  }
}

function calculateHSCGPA() {
  // Get compulsory subject grades
  const banglaGrade = parseFloat(document.getElementById('bangla').value);
  const englishGrade = parseFloat(document.getElementById('english').value);
  const ictGrade = parseFloat(document.getElementById('ict').value);
  
  // Get group subject grades
  const groupSubjectInputs = document.querySelectorAll('.group-subject');
  const groupGrades = Array.from(groupSubjectInputs)
    .map(input => parseFloat(input.value))
    .filter(grade => !isNaN(grade)); // Only include selected subjects
  
  // Get optional subject grades
  const optional1Grade = parseFloat(document.getElementById('optional1').value);
  const optional2Grade = parseFloat(document.getElementById('optional2').value);
  
  // Validation checks
  if (isNaN(banglaGrade) || isNaN(englishGrade) || isNaN(ictGrade)) {
    showResult('Please select grades for all compulsory subjects (Bangla, English, ICT)', 'error');
    return;
  }
  
  if (groupGrades.length < 3) {
    showResult('Please select grades for at least 3 group subjects', 'error');
    return;
  }
  
  // Check for failures in compulsory subjects
  if (banglaGrade === 0 || englishGrade === 0 || ictGrade === 0) {
    showResult('GPA: 0.00 (Failed in compulsory subject)', 'fail');
    return;
  }
  
  // Check for failures in group subjects
  if (groupGrades.some(grade => grade === 0)) {
    showResult('GPA: 0.00 (Failed in group subject)', 'fail');
    return;
  }
  
  // Calculate base GPA (compulsory + best 3 group subjects)
  const compulsoryGrades = [banglaGrade, englishGrade, ictGrade];
  const bestGroupGrades = groupGrades.sort((a, b) => b - a).slice(0, 3); // Best 3 group subjects
  
  const totalMainGrades = [...compulsoryGrades, ...bestGroupGrades];
  const mainGPA = totalMainGrades.reduce((sum, grade) => sum + grade, 0) / totalMainGrades.length;
  
  // Calculate bonus from optional subjects
  let bonus = 0;
  if (!isNaN(optional1Grade) && optional1Grade > 2) {
    bonus += (optional1Grade - 2) * 0.5; // Half weight for optional subjects
  }
  if (!isNaN(optional2Grade) && optional2Grade > 2) {
    bonus += (optional2Grade - 2) * 0.5; // Half weight for optional subjects
  }
  
  // Calculate final GPA
  let finalGPA = mainGPA + (bonus / totalMainGrades.length);
  
  // Cap at 5.00
  if (finalGPA > 5.00) finalGPA = 5.00;
  
  // Round to 2 decimal places
  finalGPA = parseFloat(finalGPA.toFixed(2));
  
  // Determine letter grade
  let letterGrade = "";
  if (finalGPA >= 5.00) letterGrade = "A+";
  else if (finalGPA >= 4.00) letterGrade = "A";
  else if (finalGPA >= 3.50) letterGrade = "A-";
  else if (finalGPA >= 3.25) letterGrade = "B+";
  else if (finalGPA >= 3.00) letterGrade = "B";
  else if (finalGPA >= 2.75) letterGrade = "B-";
  else if (finalGPA >= 2.50) letterGrade = "C+";
  else if (finalGPA >= 2.25) letterGrade = "C";
  else if (finalGPA >= 2.00) letterGrade = "D";
  else letterGrade = "F";
  
  // Show detailed result
  const resultText = `
    <div class="result-display">
      <h3>Your HSC GPA Result</h3>
      <div class="gpa-main">GPA: ${finalGPA} (${letterGrade})</div>
      <div class="result-breakdown">
        <p><strong>Calculation Details:</strong></p>
        <p>• Compulsory Subjects Average: ${(compulsoryGrades.reduce((a, b) => a + b) / 3).toFixed(2)}</p>
        <p>• Group Subjects Average: ${(bestGroupGrades.reduce((a, b) => a + b) / bestGroupGrades.length).toFixed(2)}</p>
        ${bonus > 0 ? `<p>• Optional Subject Bonus: +${bonus.toFixed(2)}</p>` : ''}
      </div>
    </div>
  `;
  
  showResult(resultText, 'success');
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

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add keyboard navigation for grade selections
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.classList.contains('grade')) {
      const inputs = Array.from(document.querySelectorAll('.grade'));
      const currentIndex = inputs.indexOf(document.activeElement);
      
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else {
        calculateHSCGPA();
      }
    }
  });
  
  // Add input validation
  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('grade')) {
      e.target.classList.remove('error');
    }
  });
});

// Reset form function
function resetForm() {
  document.getElementById('gpaForm').reset();
  document.getElementById('result').style.display = 'none';
  document.querySelectorAll('.group-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.getElementById('gpaForm').style.display = 'none';
}