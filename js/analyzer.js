const resumeFile=document.getElementById("resumeFile");
const analyzeBtn=document.getElementById("analyzeBtn");
const analysisResult=document.getElementById("analysisResult");

const technicalSkills =[
    "html",
    "css",
    "javascript",
    "python",
    "java",
    "sql",
    "react",
    "git",
    "github",
    "node.js"
];
analyzeBtn.addEventListener("click" , function(){
    if(resumeFile.files.length ===0){
        analysisResult.textContent="Please select your resume first."
        return;
    }
    const file=resumeFile.files[0];
    //analysisResult.textContent="Resume Selected:" +file.name;



    if(file.type !== "text/plain"){
        analysisResult.textContent="For this demo, plese upload a .txt resume file.";
        return;
    }
    //loading message
    //analysisResult.innerHTML=`<div class="loading-message"><p>Analyzing your resume...</p></div>`;


    const reader = new FileReader();
    reader.onload=function(event){
        const resumeText=event.target.result.toLowerCase();

        let foundSkills=[];
        let missingSkills=[];
        technicalSkills.forEach(function(skill){

            const skillPattern=new RegExp("\\b" + skill.replace(".","\\.") +"\\b","i");
            if(skillPattern.test(resumeText)){
                foundSkills.push(skill);
            }
            else{
                missingSkills.push(skill);
            }
        });




        const keywords=[
            "skills",
            "education",
            "experience",
            "projects"
        ];
        let found=0;
        let missing=[];

        keywords.forEach((keyword) =>{
            if(resumeText.includes(keyword)){
                found++;
            }
            else{
                missing.push(keyword);
            }
        });
        const emailPattern=/[^\s@]+@[^\s@]+\.[^\s@]+/;
        const hasEmail=emailPattern.test(resumeText);
        const cleanResumeText=resumeText.replace(/[\s-]/g,"");

        const phonePattern=/(?:\+92|0092|0)3\d{9}/;
        const hasPhone=phonePattern.test(resumeText);

        if(hasEmail){
            found++;
        }else{
            missing.push("email");
        }

        if(hasPhone){
            found++;
        }else{
            missing.push("phone");
        }

        const totalSections=keywords.length +2;
        // =========================
        // IMPROVEMENT SUGGESTIONS
        // =========================

        let suggestions = [];

        if (missing.includes("education")) {
            suggestions.push("Add your education details.");
        }

        if (missing.includes("experience")) {
            suggestions.push("Add your work or internship experience.");
        }

        if (missing.includes("projects")) {
            suggestions.push("Add your projects to show your practical skills.");
        }

        if (missing.includes("skills")) {
            suggestions.push("Add a clear technical skills section.");
        }

        if (missing.includes("email")) {
            suggestions.push("Add a professional email address.");
        }

        if (missing.includes("phone")) {
            suggestions.push("Add your phone number in the contact section.");
        }

        if (foundSkills.length < 4) {
            suggestions.push("Add more relevant technical skills to your resume.");
        }

        if (suggestions.length === 0) {
            suggestions.push("Your resume has all the important sections. Keep improving the content.");
        }

        const sectionScore=Math.round((found/totalSections)*100);
        const skillScore=Math.round((foundSkills.length/technicalSkills.length)*100);
        const score=Math.round((sectionScore + skillScore)/2);
        localStorage.setItem("sectionScore", sectionScore);
        localStorage.setItem("skillScore", skillScore);
        localStorage.setItem("resumeScore", score);
        
        

        analysisResult.innerHTML=`
        <h3>Resume Analysis</h3>

        <p><strong>Resume:</strong> ${file.name}</p>

        <p><strong>Score:</strong> ${sectionScore}%</p>

        <p><strong>Sections Found:</strong> ${found}/${totalSections}</p>

        <p><strong>Missing Sections:</strong> 
        ${missing.length > 0 ? missing.join(", ") : "None"}
        </p>

        <h3>Technical Skills</h3>

        <p><strong>Skills Found:</strong>
        ${foundSkills.length > 0 ? foundSkills.join(", ") : "None"}
        </p>

        <p><strong>Missing Skills:</strong>
        ${missingSkills.length > 0 ? missingSkills.join(", ") : "None"}
        </p>
        <h3>Improvement Suggestions</h3>

        <ul>
            ${
                suggestions.map(function (suggestion) {
                    return `<li>${suggestion}</li>`;
                }).join("")
            }
        </ul>

        `;


    };
    reader.readAsText(file);
});



const tipsBtn=document.getElementById("tipsBtn");
//const tipsResult=document.getElementById("tipsResult");

tipsBtn.addEventListener("click",function(){

    if(resumeFile.files.length ===0){
        alert("Please select your resume first.");
        return;
    }


    const tipsDescription= document.getElementById("tipsDescription");
    const tipsResult=document.getElementById("tipsResult");
    tipsDescription.style.display="block";
    tipsResult.style.display="block";


    tipsResult.innerHTML="<p>Loading tips....</p>";

    fetch("data/tips.json")
    .then(function (response){
        return response.json();

    })
    .then(function(data){
        let tipsHTML="<h3>Resume Improvement Tips</h3>";
        tipsHTML +="<ul>";
        data.tips.forEach(function(tip){
            tipsHTML+=`<li>${tip}</li>`;

        });
        tipsHTML+="</ul>";
        tipsResult.innerHTML=tipsHTML;

    })
    .catch(function(error){
        tipsResult.innerHTML="<p>Unable to load resume tips.</p>";
        console.log(error);
    });
    
});





const scoreBtn = document.getElementById("scoreBtn");
//const scoreResult=document.getElementById("scoreResult");

scoreBtn.addEventListener("click", function () {

    if(resumeFile.files.length ===0){
        alert("Please select your resume first.");
        return;
    }

    const scoreDescription=document.getElementById("scoreDescription");
    const scoreResult=document.getElementById("scoreResult");
    scoreDescription.style.display="block";
    scoreResult.style.display="block";

    const savedScore = localStorage.getItem("resumeScore");

    if (savedScore === null) {
        scoreResult.innerHTML = `
            <h3>Resume Score</h3>
            <p>Please analyze your resume first.</p>
        `;
        return;
    }

    let message = "";

    if (savedScore >= 80) {
        message = "Excellent! Your resume has strong content.";
    } else if (savedScore >= 60) {
        message = "Good! Your resume can still be improved.";
    } else {
        message = "Your resume needs some improvement.";
    }

    scoreResult.innerHTML = `
        <h3>Overall Resume Score</h3>

        <div class="score-circle">
            <span>${savedScore}%</span>
        </div>

        <p>${message}</p>
        <div class="score-item">

            <div class="score-label">
                <strong>Sections Score</strong>
                <span>${localStorage.getItem("sectionScore")}%</span>
            </div>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: ${localStorage.getItem("sectionScore")}%;">
                </div>
            </div>

       </div>
       <div class="score-item">

            <div class="score-label">
                <strong>Skills Score</strong>
                <span>${localStorage.getItem("skillScore")}%</span>
            </div>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="width: ${localStorage.getItem("skillScore")}%;">
                </div>
            </div>

        </div>
        

        

        <p><strong>Score is based on:</strong></p>

        <ul>
            <li>Resume sections</li>
            <li>Technical skills</li>
            <li>Contact information</li>
            <li>Education and experience</li>
            <li>Projects</li>
        </ul>
    `;
});

// =========================
// RESET RESULTS WHEN NEW FILE IS SELECTED
// =========================

resumeFile.addEventListener("change", function () {

    analysisResult.innerHTML = `
        <p class="result-placeholder">
            Analyze your resume to see the results.
        </p>
    `;

    document.getElementById("scoreResult").style.display = "none";
    document.getElementById("tipsResult").style.display = "none";

    document.getElementById("scoreDescription").style.display = "none";
    document.getElementById("tipsDescription").style.display = "none";

    localStorage.removeItem("sectionScore");
    localStorage.removeItem("skillScore");
    localStorage.removeItem("resumeScore");
});

// =========================
// DOWNLOAD REPORT
// =========================

const downloadReportBtn =
    document.getElementById("downloadReportBtn");
    
    downloadReportBtn.addEventListener("click", function () {

    // Check if a resume is selected
    if (resumeFile.files.length === 0) {
        alert("Please select and analyze your resume first.");
        return;
    }

    const savedScore =
        localStorage.getItem("resumeScore");

    // Check if the selected resume has been analyzed
    if (savedScore === null) {
        alert("Please analyze your resume first.");
        return;
    }



    const sectionScore =
        localStorage.getItem("sectionScore");

    const skillScore =
        localStorage.getItem("skillScore");

    const report = `
RESUME ANALYSIS REPORT
======================

Overall Resume Score: ${savedScore}%

Sections Score: ${sectionScore}%

Skills Score: ${skillScore}%

This report is based on:
- Resume sections
- Technical skills
- Contact information
- Education and experience
- Projects

Thank you for using Resume Analyzer.
`;

    const blob = new Blob([report], {
        type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Resume-Analysis-Report.txt";

    link.click();

    URL.revokeObjectURL(url);
});
