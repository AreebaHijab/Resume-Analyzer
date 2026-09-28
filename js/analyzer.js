const resumeFile = document.getElementById("resumeFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const analysisResult = document.getElementById("analysisResult");

const technicalSkills = [
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


// ========================================
// PDF TEXT READER
// ========================================

async function readPDF(file) {

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const pageText = textContent.items
            .map(function (item) {
                return item.str;
            })
            .join(" ");

        fullText += pageText + "\n";
    }

    return fullText;
}


// ========================================
// DOCX TEXT READER
// ========================================

async function readDOCX(file) {

    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
    });

    return result.value;
}


// ========================================
// MAIN ANALYZER
// ========================================

function analyzeResume(resumeText, fileName) {

    resumeText = resumeText.toLowerCase();


    // ========================================
    // TECHNICAL SKILLS
    // ========================================

    let foundSkills = [];
    let missingSkills = [];

    technicalSkills.forEach(function (skill) {

        const skillPattern = new RegExp(
            "\\b" + skill.replace(".", "\\.") + "\\b",
            "i"
        );

        if (skillPattern.test(resumeText)) {

            foundSkills.push(skill);

        } else {

            missingSkills.push(skill);

        }

    });


    // ========================================
    // RESUME SECTIONS
    // ========================================

    const keywords = [
        "skills",
        "education",
        "experience",
        "projects"
    ];

    let found = 0;
    let missing = [];

    keywords.forEach(function (keyword) {

        if (resumeText.includes(keyword)) {

            found++;

        } else {

            missing.push(keyword);

        }

    });


    // ========================================
    // EMAIL
    // ========================================

    const emailPattern =
        /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

    const hasEmail =
        emailPattern.test(resumeText);


    // ========================================
    // PHONE
    // ========================================

    const cleanResumeText =
        resumeText.replace(/[\D]/g, "");

    const phonePattern =
        /(?:92|0092|0)?3\d{9}/;

    const hasPhone =
        phonePattern.test(cleanResumeText);


    if (hasEmail) {

        found++;

    } else {

        missing.push("email");

    }


    if (hasPhone) {

        found++;

    } else {

        missing.push("phone");

    }


    // ========================================
    // TOTAL SECTIONS
    // ========================================

    const totalSections =
        keywords.length + 2;


    // ========================================
    // IMPROVEMENT SUGGESTIONS
    // ========================================

    let suggestions = [];


    if (missing.includes("education")) {

        suggestions.push(
            "Add your education details."
        );

    }


    if (missing.includes("experience")) {

        suggestions.push(
            "Add your work or internship experience."
        );

    }


    if (missing.includes("projects")) {

        suggestions.push(
            "Add your projects to show your practical skills."
        );

    }


    if (missing.includes("skills")) {

        suggestions.push(
            "Add a clear technical skills section."
        );

    }


    if (missing.includes("email")) {

        suggestions.push(
            "Add a professional email address."
        );

    }


    if (missing.includes("phone")) {

        suggestions.push(
            "Add your phone number in the contact section."
        );

    }


    if (foundSkills.length < 4) {

        suggestions.push(
            "Add more relevant technical skills to your resume."
        );

    }


    if (suggestions.length === 0) {

        suggestions.push(
            "Your resume has all the important sections. Keep improving the content."
        );

    }


    // ========================================
    // SCORE CALCULATION
    // ========================================

    const sectionScore =
        Math.round(
            (found / totalSections) * 100
        );


    const skillScore =
        Math.round(
            (foundSkills.length / technicalSkills.length) * 100
        );


    const score =
        Math.round(
            (sectionScore + skillScore) / 2
        );


    // ========================================
    // SAVE SCORES
    // ========================================

    localStorage.setItem(
        "sectionScore",
        sectionScore
    );

    localStorage.setItem(
        "skillScore",
        skillScore
    );

    localStorage.setItem(
        "resumeScore",
        score
    );


    // ========================================
    // DISPLAY ANALYSIS
    // ========================================

    analysisResult.innerHTML = `

        <h3>Resume Analysis</h3>

        <p>
            <strong>Resume:</strong>
            ${fileName}
        </p>

        <p>
            <strong>Section Score:</strong>
            ${sectionScore}%
        </p>

        <p>
            <strong>Sections Found:</strong>
            ${found}/${totalSections}
        </p>

        <p>
            <strong>Missing Sections:</strong>
            ${
                missing.length > 0
                    ? missing.join(", ")
                    : "None"
            }
        </p>


        <h3>Technical Skills</h3>

        <p>
            <strong>Skills Found:</strong>
            ${
                foundSkills.length > 0
                    ? foundSkills.join(", ")
                    : "None"
            }
        </p>

        <p>
            <strong>Missing Skills:</strong>
            ${
                missingSkills.length > 0
                    ? missingSkills.join(", ")
                    : "None"
            }
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
}


// ========================================
// ANALYZE BUTTON
// ========================================

analyzeBtn.addEventListener(
    "click",
    async function () {

        if (resumeFile.files.length === 0) {

            analysisResult.textContent =
                "Please select your resume first.";

            return;
        }


        const file =
            resumeFile.files[0];


        const fileName =
            file.name.toLowerCase();


        // ========================================
        // FILE TYPE CHECK
        // ========================================

        if (
            !fileName.endsWith(".txt") &&
            !fileName.endsWith(".docx") &&
            !fileName.endsWith(".pdf")
        ) {

            analysisResult.textContent =
                "Please upload a TXT, DOCX or PDF resume.";

            return;
        }


        // ========================================
        // LOADING MESSAGE
        // ========================================

        analysisResult.innerHTML = `
            <p>Analyzing your resume...</p>
        `;


        try {

            let resumeText = "";


            // ========================================
            // TXT
            // ========================================

            if (fileName.endsWith(".txt")) {

                resumeText =
                    await file.text();

            }


            // ========================================
            // DOCX
            // ========================================

            else if (fileName.endsWith(".docx")) {

                resumeText =
                    await readDOCX(file);

            }


            // ========================================
            // PDF
            // ========================================

            else if (fileName.endsWith(".pdf")) {

                resumeText =
                    await readPDF(file);

            }


            // ========================================
            // EMPTY FILE CHECK
            // ========================================

            if (!resumeText.trim()) {

                analysisResult.innerHTML = `
                    <p>
                        Unable to find readable text in this resume.
                    </p>
                `;

                return;
            }


            // ========================================
            // RUN ANALYSIS
            // ========================================

            analyzeResume(
                resumeText,
                file.name
            );


        } catch (error) {

            console.log(error);

            analysisResult.innerHTML = `
                <p>
                    Unable to read this resume file.
                </p>
            `;
        }

    }
);


// ========================================
// RESUME TIPS - FETCH API
// ========================================

const tipsBtn =
    document.getElementById("tipsBtn");


tipsBtn.addEventListener(
    "click",
    function () {

        if (resumeFile.files.length === 0) {

            alert(
                "Please select your resume first."
            );

            return;
        }


        const tipsDescription =
            document.getElementById(
                "tipsDescription"
            );


        const tipsResult =
            document.getElementById(
                "tipsResult"
            );


        tipsDescription.style.display =
            "block";


        tipsResult.style.display =
            "block";


        tipsResult.innerHTML =
            "<p>Loading tips....</p>";


        fetch("data/tips.json")

            .then(function (response) {

                return response.json();

            })


            .then(function (data) {

                let tipsHTML =
                    "<h3>Resume Improvement Tips</h3>";


                tipsHTML += "<ul>";


                data.tips.forEach(
                    function (tip) {

                        tipsHTML +=
                            `<li>${tip}</li>`;

                    }
                );


                tipsHTML += "</ul>";


                tipsResult.innerHTML =
                    tipsHTML;

            })


            .catch(function (error) {

                tipsResult.innerHTML =
                    "<p>Unable to load resume tips.</p>";

                console.log(error);

            });

    }
);


// ========================================
// RESUME SCORE
// ========================================

const scoreBtn =
    document.getElementById("scoreBtn");


scoreBtn.addEventListener(
    "click",
    function () {

        if (resumeFile.files.length === 0) {

            alert(
                "Please select your resume first."
            );

            return;
        }


        const scoreDescription =
            document.getElementById(
                "scoreDescription"
            );


        const scoreResult =
            document.getElementById(
                "scoreResult"
            );


        scoreDescription.style.display =
            "block";


        scoreResult.style.display =
            "block";


        const savedScore =
            localStorage.getItem(
                "resumeScore"
            );


        if (savedScore === null) {

            scoreResult.innerHTML = `
                <h3>Resume Score</h3>
                <p>Please analyze your resume first.</p>
            `;

            return;
        }


        let message = "";


        if (savedScore >= 80) {

            message =
                "Excellent! Your resume has strong content.";

        }

        else if (savedScore >= 60) {

            message =
                "Good! Your resume can still be improved.";

        }

        else {

            message =
                "Your resume needs some improvement.";

        }


        scoreResult.innerHTML = `

            <h3>Overall Resume Score</h3>


            <div class="score-circle">

                <span>
                    ${savedScore}%
                </span>

            </div>


            <p>
                ${message}
            </p>


            <div class="score-item">

                <div class="score-label">

                    <strong>
                        Sections Score
                    </strong>

                    <span>
                        ${localStorage.getItem("sectionScore")}%
                    </span>

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

                    <strong>
                        Skills Score
                    </strong>

                    <span>
                        ${localStorage.getItem("skillScore")}%
                    </span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width: ${localStorage.getItem("skillScore")}%;">
                    </div>

                </div>

            </div>


            <p>
                <strong>Score is based on:</strong>
            </p>


            <ul>

                <li>Resume sections</li>
                <li>Technical skills</li>
                <li>Contact information</li>
                <li>Education and experience</li>
                <li>Projects</li>

            </ul>

        `;

    }
);


// ========================================
// RESET WHEN NEW FILE IS SELECTED
// ========================================

resumeFile.addEventListener("change", function () {

    // Reset analysis
    analysisResult.innerHTML = `
        <p class="result-placeholder">
            Analyze your resume to see the results.
        </p>
    `;


    // Reset desktop results
    const scoreResult =
        document.getElementById("scoreResult");

    const tipsResult =
        document.getElementById("tipsResult");


    scoreResult.innerHTML = "";
    tipsResult.innerHTML = "";


    scoreResult.style.display = "none";
    tipsResult.style.display = "none";


    // Reset descriptions
    document.getElementById(
        "scoreDescription"
    ).style.display = "none";

    document.getElementById(
        "tipsDescription"
    ).style.display = "none";


    // Reset mobile results
    const mobileAnalysis =
        document.getElementById("mobileAnalysisResult");

    const mobileTips =
        document.getElementById("mobileTipsResult");

    const mobileScore =
        document.getElementById("mobileScoreResult");


    if (mobileAnalysis) {
        mobileAnalysis.innerHTML = "";
    }

    if (mobileTips) {
        mobileTips.innerHTML = "";
    }

    if (mobileScore) {
        mobileScore.innerHTML = "";
    }


    // Remove old saved score
    localStorage.removeItem("sectionScore");
    localStorage.removeItem("skillScore");
    localStorage.removeItem("resumeScore");

});


// ========================================
// DOWNLOAD REPORT
// ========================================

const downloadReportBtn =
    document.getElementById(
        "downloadReportBtn"
    );


downloadReportBtn.addEventListener(
    "click",
    function () {

        if (resumeFile.files.length === 0) {

            alert(
                "Please select and analyze your resume first."
            );

            return;
        }


        const savedScore =
            localStorage.getItem(
                "resumeScore"
            );


        if (savedScore === null) {

            alert(
                "Please analyze your resume first."
            );

            return;
        }


        const sectionScore =
            localStorage.getItem(
                "sectionScore"
            );


        const skillScore =
            localStorage.getItem(
                "skillScore"
            );


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


        const blob =
            new Blob(
                [report],
                {
                    type: "text/plain"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;


        link.download =
            "Resume-Analysis-Report.txt";


        link.click();


        URL.revokeObjectURL(url);

    }
);