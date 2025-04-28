const subjectList = {
  science: ["Bangla (1st + 2nd)", "English (1st + 2nd)", "Mathematics", "Bangladesh & Global Studies", "Physics", "Chemistry", "Biology", "Religion"],
  humanities: ["Bangla (1st + 2nd)", "English (1st + 2nd)", "Mathematics", "Social science", "Civics", "Economics/History", "General Science", "Religion"],
  commerce: ["Bangla (1st + 2nd)", "English (1st + 2nd)", "Masocial scienceangladesh & Global Studies", "Accounting", "Business Entrepreneurship", "Finance & Banking", "Religion"]
};

// Show subjects based on selected group
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
    subjectList[group].forEach((subject, index) => {
      const delay = index * 0.05;
      
      subjectsDiv.innerHTML += `
        <div class="subject" style="animation-delay: ${delay}s">
          <label for="${subject.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${subject}:</label>
          <select class="grade" id="${subject.toLowerCase().replace(/[^a-z0-9]/g, '-')}" aria-label="${subject} Grade">
            <option value="">--Grade--</option>
            <option value="5">A+</option>
            <option value="4">A</option>
            <option value="3.5">A-</option>
            <option value="3">B</option>
            <option value="2">C</option>
            <option value="1">D</option>
            <option value="0">F</option>
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

function calculateGPA() {
  const gradeInputs = document.querySelectorAll('.grade');
  const grades = Array.from(gradeInputs).slice(0, -2).map(input => parseFloat(input.value) || 0); // Exclude ICT and Optional
  const ictGrade = parseFloat(document.getElementById('ict').value) || 0;
  const optionalGrade = parseFloat(document.getElementById('optional').value) || 0;
  
  // Check if any fields are empty
  if (grades.some(isNaN) || isNaN(ictGrade)) {
    showResult('Please select grades for all subjects', 'error');
    return;
  }

  // Check if any subject is F (Fail)
  let fail = grades.some(g => g === 0) || ictGrade === 0;

  if (fail) {
    showResult('GPA: 0.00 (Failed)', 'fail');
    return;
  }

  let totalGPA = grades.reduce((sum, g) => sum + g, 0) + ictGrade;

  // Optional subject bonus if GPA > 2
  let bonus = 0;
  if (optionalGrade > 2) {
    bonus = optionalGrade - 2;
  }

  let mainSubjectCount = grades.length + 1; // main + ICT
  let finalGPA = ((totalGPA + bonus) / mainSubjectCount).toFixed(2);

  if (finalGPA > 5.00) finalGPA = 5.00;

  // Find Letter Grade
  let letterGrade = "";
  if (finalGPA >= 5.00) letterGrade = "A+";
  else if (finalGPA >= 4.00) letterGrade = "A";
  else if (finalGPA >= 3.5) letterGrade = "A-";
  else if (finalGPA >= 3.0) letterGrade = "B";
  else if (finalGPA >= 2.0) letterGrade = "C";
  else if (finalGPA >= 1.0) letterGrade = "D";
  else letterGrade = "F";

  showResult(`GPA: ${finalGPA} (${letterGrade})`, 'success');
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
        calculateGPA();
      }
    }
  });
});