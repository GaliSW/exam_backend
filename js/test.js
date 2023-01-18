let app = new Vue({
    el: "#app",
    data: {
        createOpen: false,
        testName: "尚未選擇",
        testList: {},
        questionCount: 0,
        single: [],
        group: [],
        boolean: [],
        pop: false,
        nowSubject: 1,
        subjectId: "",
        testTypeId: "",
        grade: 0,
        semester: 0,
        explanation: "string",
        duration: "",
        deletePop: {
            isOpen: false,
            name: "",
            id: 0,
        },
        status: 0,
        nowSemester: "",
        checkPop: false, //審核視窗
        deniedPop: false, //下架視窗
        hasWrong: false, //是否有需訂正的題目
        canAction: false, //是否已審核全部題目，可以進行下一步
        testId: 0,
        optionCorrectList: [], //審核題目的array - option
        questionCorrectList: [], //審核題目的array - question
        optionWrongList: [], //審核題目的array - option
        questionWrongList: [], //審核題目的array - question
        testCount: [], //考試總頁數arr
        pageCount: 0, // 總頁數區間 每10頁一個區間
        nowPage: 1,
        firstPage: 1,
        lastPage: 10,
        searchText: "",
    },
    created() {
        this.getExamList(0);
        this.concatName();
    },
    watch: {
        nowPage: function (newValue, oldValue) {
            if (newValue === 0) {
                this.nowPage = 1;
            }
            if (newValue > this.testCount.length && newValue < this.lastPage) {
                this.nowPage = this.testCount.length;
            }
            if (newValue > this.lastPage && newValue < this.testCount.length) {
                this.firstPage += 10;
                this.lastPage += 10;
            }
            if (newValue < this.firstPage && newValue !== 0) {
                this.firstPage -= 10;
                this.lastPage -= 10;
            }

            this.getExamList(this.status);
        },
    },
    methods: {
        concatName() {
            const year = document.getElementById("year").value;
            let chSemester;
            switch (Number(document.getElementById("semester").value)) {
                case 0:
                    this.grade = 4;
                    this.semester = 0;
                    chSemester = "(素養)";
                    break;
                case 1:
                    this.grade = 1;
                    this.semester = 1;
                    chSemester = "(七上)";
                    break;
                case 2:
                    this.grade = 1;
                    this.semester = 2;
                    chSemester = "(七下)";
                    break;
                case 3:
                    this.grade = 2;
                    this.semester = 3;
                    chSemester = "(八上)";
                    break;
                case 4:
                    this.grade = 2;
                    this.semester = 4;
                    chSemester = "(八下)";
                    break;
                case 5:
                    this.grade = 3;
                    this.semester = 5;
                    chSemester = "(九上)";
                    break;
                case 6:
                    this.grade = 3;
                    this.semester = 6;
                    chSemester = "(九下)";
                    break;
                case 7:
                    this.grade = 3;
                    this.semester = 7;
                    chSemester = "(總複習)";
                    break;
                default:
                    chSemester = "冊別";
                    break;
            }
            let chSubject;
            switch (Number(document.getElementById("subject").value)) {
                case 1:
                    chSubject = "國文";
                    break;
                case 3:
                    chSubject = "英文";
                    break;
                case 5:
                    chSubject = "數學";
                    break;
                case 7:
                    chSubject = "理化";
                    break;
                case 8:
                    chSubject = "生物";
                    break;
                case 9:
                    chSubject = "地科";
                    break;
                case 11:
                    chSubject = "公民";
                    break;
                case 12:
                    chSubject = "地理";
                    break;
                case 13:
                    chSubject = "歷史";
                    break;
                default:
                    chSubject = "科目";
                    break;
            }
            let chType;
            switch (Number(document.getElementById("test_type").value)) {
                case 1:
                    chType = "周卷";
                    break;
                case 2:
                    chType = "段考";
                    break;
                case 3:
                    chType = "模考";
                    break;
                case 4:
                    chType = "多練習";
                    break;
                default:
                    chType = "類型";
                    break;
            }
            let chSource;
            switch (Number(document.getElementById("source").value)) {
                case 1:
                    chSource = "康軒";
                    break;
                case 2:
                    chSource = "南一";
                    break;
                case 3:
                    chSource = "翰林";
                    break;
                case 4:
                    chSource = "自編";
                    break;
                default:
                    chSource = "出版社";
                    break;
            }
            const range = document.getElementById("range").value;
            this.testName =
                year +
                chSemester +
                chSubject +
                chType +
                "_" +
                chSource +
                "_" +
                range;
        },

        transGrade(num) {
            switch (num) {
                case 1:
                    return "國七";
                case 2:
                    return "國八";
                case 3:
                    return "國九";
                case 4:
                    return "不分";
            }
        },

        getExamList() {
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests?SubjectId=${this.nowSubject}&SemesterId=${this.nowSemester}&PageNumber=${this.nowPage}&PageSize=10&ApprovalStatusId=${this.status}&SearchText=${this.searchText}`,
                method: "GET",
                success: function (res) {
                    console.log(res);
                    app.testList = res;
                    app.getTestCount();
                },
            });
        },

        getTestCount() {
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests/Count?SubjectId=${app.nowSubject}&ApprovalStatusId=${app.status}`,
                method: "GET",
                success: function (res) {
                    app.testCount = [];
                    let item = Math.ceil(res / 10);
                    app.pageCount = Math.ceil(item / 10);
                    for (let i = 0; i < item; i++) {
                        app.testCount.push(i + 1);
                    }
                    console.log(app.testCount);
                },
            });
        },

        search() {
            const text = document.getElementById("searchText").value;
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests?SubjectId=${this.nowSubject}&SemesterId=${this.nowSemester}&PageNumber=${this.nowPage}&PageSize=10&ApprovalStatusId=${app.status}&SearchText=${text}`,
                method: "GET",
                success: function (res) {
                    console.log(res);
                    app.testList = res;
                    app.getTestCount();
                },
            });
        },

        subjectChange(e) {
            this.nowSubject = Number(e.target.value);
            this.getExamList(app.status);
        },

        statusChange(e) {
            this.status = Number(e.target.value);
            this.getExamList();
        },

        gradeChange(e) {
            this.nowSemester = e.target.value;
            this.getExamList(app.status);
        },

        getExamContent(id, status) {
            app.optionCorrectList = [];
            app.questionCorrectList = [];
            app.optionWrongList = [];
            app.questionWrongList = [];
            app.single = [];
            app.group = [];
            app.boolean = [];
            app.testId = id;
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests/Details/${id}
        `,
                method: "GET",
                success: function (res) {
                    console.log(res);
                    if (res === "") {
                        alert("此考卷尚未有考題");
                        return;
                    }
                    app.testName = res.testName;
                    app.questionCount = res.questionCount;
                    const questionsArr = res.questions;
                    questionsArr.forEach((item, index) => {
                        switch (item.questionTypeId) {
                            case 1:
                                app.single.push(item);
                                break;
                            case 2:
                                app.group.push(item);
                                break;
                            case 4:
                                app.boolean.push(item);
                                break;
                        }
                    });
                    switch (status) {
                        case 1:
                            app.pop = true;
                            break;
                        case 2:
                            app.checkPop = true;
                            app.canAction = false;
                            app.hasWrong = false;
                            setTimeout(() => {
                                app.actionCheck();
                            }, 1000);
                            break;
                        case 3:
                            app.canAction = false;
                            app.hasWrong = false;
                            app.deniedPop = true;
                            break;
                    }
                    if (app.nowSubject === 5 || app.nowSubject === 7) {
                        setTimeout(() => {
                            app.translate();
                        }, 1000);
                    }
                },
            });
        },

        actionCheck(e) {
            const totalCount = document.querySelectorAll(
                "input[type=radio]:checked"
            ).length;
            console.log(totalCount, this.questionCount);
            const wrongCount =
                document.querySelectorAll(".wrong:checked").length;

            if (totalCount === this.questionCount) {
                this.canAction = true;
            } else {
                this.canAction = false;
            }
            if (wrongCount > 0) {
                this.hasWrong = true;
            } else {
                this.hasWrong = false;
            }
        },

        translate() {
            MathJax.Hub.Config({
                config: ["Accessible.js", "Safe.js"],
                errorSettings: { message: ["!"] },
                skipStartupTypeset: true,
                messageStyle: "none",
                CommonHTML: { linebreaks: { automatic: true } },
                "HTML-CSS": { linebreaks: { automatic: true } },
                SVG: { linebreaks: { automatic: true } },
            });
            const qsList = document.querySelectorAll(".question");
            qsList.forEach((item, index) => {
                const render = document.querySelectorAll(".trans_title")[index];
                render.innerText = "";
                const text = decodeURI(item.innerText);
                render.append("`" + text + "`");
                item.innerText = "";
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, render[0]]);
            });
            const ansList = document.querySelectorAll(".answer");
            ansList.forEach((item, index) => {
                const render = document.querySelectorAll(".trans_ans")[index];
                render.innerText = "";
                render.append("`" + item.innerText + "`");
                item.innerText = "";
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, render[0]]);
            });
            const anaList = document.querySelectorAll(".analysis");
            anaList.forEach((item, index) => {
                const render =
                    document.querySelectorAll(".trans_analysis")[index];
                render.innerText = "";
                render.append("`" + item.innerText + "`");
                item.innerText = "";
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, render[0]]);
            });
        },

        createTest() {
            const year = document.getElementById("year").value;
            const semester = document.getElementById("semester").value;
            const subject = document.getElementById("subject").value;
            const type = document.getElementById("test_type").value;
            const source = document.getElementById("source").value;
            const range = document.getElementById("range").value;
            const grade = app.grade;
            const time = document.getElementById("time").value;
            if (
                year == "" ||
                semester == "" ||
                subject == "" ||
                type == "" ||
                source == "" ||
                range == "" ||
                time == "" ||
                grade === 0
            ) {
                alert("請完成必填欄位");
            } else {
                const json = JSON.stringify({
                    subjectId: app.subjectId,
                    testTypeId: app.testTypeId,
                    schoolYearId: app.grade,
                    testName: app.testName,
                    duration: app.duration,
                });
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Tests
                    `,
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        const url = "http://127.0.0.1:5579/questions.html";
                        location.href =
                            url +
                            `?testName=${app.testName}&subject=${app.subjectId}&testId=${res.id}&grade=${app.grade}&status=0`;
                    },
                });
            }
        },

        editTest(name, id, grade, status) {
            const url = "http://127.0.0.1:5579/questions.html";
            location.href =
                url +
                `?testName=${name}&subject=${app.nowSubject}&testId=${id}&grade=${grade}&status=${status}`;
        },

        deleteTest(status, name, id) {
            if (status === 0) {
                app.deletePop = {
                    isOpen: true,
                    name: name,
                    id: id,
                };
            } else if (status === 1) {
                app.deletePop.isOpen = false;
            } else {
                $.ajax({
                    url: ` https://questionapi-docker.funday.asia:9010/api/Tests/${app.deletePop.id}
                            `,
                    method: "DELETE",
                    success: function () {
                        app.deletePop.isOpen = false;
                        setTimeout(() => {
                            app.getExamList(0);
                        }, 1000);
                    },
                });
            }
        },

        approveTest() {
            if (!app.canAction || app.hasWrong) return;
            for (let i = 0; i < app.optionCorrectList.length; i++) {
                const optionJson = JSON.stringify({
                    id: app.optionCorrectList[i],
                    approvalStatusId: 2,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/ApprovalStatus",
                    method: "PUT",
                    data: optionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        // console.log(res);
                    },
                });
                const questionJson = JSON.stringify({
                    id: app.questionCorrectList[i],
                    approvalStatusId: 2,
                });
                console.log(app.questionCorrectList[i]);
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Questions/ApprovalStatus",
                    method: "PUT",
                    data: questionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        // console.log(res);
                    },
                });
            }

            const testJson = JSON.stringify({
                id: app.testId,
                approvalStatusId: 2,
            });
            $.ajax({
                url: "https://questionapi-docker.funday.asia:9010/api/Tests/UpdateApprovalStatus",
                method: "PUT",
                data: testJson,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    // console.log(res);
                },
            });
            app.checkPop = false;
            setTimeout(() => {
                app.status = 2;
                app.getExamList(2);
            }, 1000);
        },

        checkQuestion(status, type, qsId, opId) {
            let copindex = app.optionCorrectList.findIndex((el) => {
                return el === opId;
            });
            if (copindex > -1) {
                app.optionCorrectList.splice(copindex, 1);
            }
            let cqsindex = app.questionCorrectList.findIndex((el) => {
                return el === qsId;
            });
            if (cqsindex > -1) {
                app.questionCorrectList.splice(cqsindex, 1);
            }
            let wopindex = app.optionWrongList.findIndex((el) => {
                return el === opId;
            });
            if (wopindex > -1) {
                app.optionWrongList.splice(wopindex, 1);
            }
            let wqsindex = app.questionWrongList.findIndex((el) => {
                return el === opId;
            });
            if (wqsindex > -1) {
                app.questionWrongList.splice(wqsindex, 1);
            }
            switch (type) {
                case "single":
                    if (status === 2) {
                        app.optionCorrectList.push(opId);
                        app.questionCorrectList.push(qsId);
                    } else {
                        app.optionWrongList.push(opId);
                        app.questionWrongList.push(qsId);
                    }
                    break;
                case "boolean":
                    if (status === 2) {
                        app.optionCorrectList.push(opId);
                        app.questionCorrectList.push(qsId);
                    } else {
                        app.optionWrongList.push(opId);
                        app.questionWrongList.push(qsId);
                    }
                    break;
                case "group":
                    if (status === 2) {
                        app.optionCorrectList.push(opId);
                        app.questionCorrectList.push(qsId);
                    } else {
                        app.optionWrongList.push(opId);
                        app.questionWrongList.push(qsId);
                    }
                    break;
            }
        },

        rejectTest(status) {
            if (!app.canAction || !app.hasWrong) return;

            for (let i = 0; i < app.optionCorrectList.length; i++) {
                //put comments
                const optionComment = JSON.stringify({
                    id: app.optionCorrectList[i],
                    comments: "",
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/Comment",
                    method: "PUT",
                    data: optionComment,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {},
                });

                const optionJson = JSON.stringify({
                    id: app.optionCorrectList[i],
                    approvalStatusId: 2,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/ApprovalStatus",
                    method: "PUT",
                    data: optionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        // console.log(res);
                    },
                });
                const questionJson = JSON.stringify({
                    id: app.questionCorrectList[i],
                    approvalStatusId: 2,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Questions/ApprovalStatus",
                    method: "PUT",
                    data: questionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        // console.log(res);
                    },
                });
            }

            for (let i = 0; i < app.optionWrongList.length; i++) {
                //put comments
                const opId = app.optionWrongList[i];
                const comments = document.getElementById(
                    `comments_${opId}`
                ).value;

                const optionComment = JSON.stringify({
                    id: app.optionWrongList[i],
                    comments: comments,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/Comment",
                    method: "PUT",
                    data: optionComment,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        console.log(res);
                    },
                });

                //put option status
                const optionJson = JSON.stringify({
                    id: app.optionWrongList[i],
                    approvalStatusId: status,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/ApprovalStatus",
                    method: "PUT",
                    data: optionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        console.log(res, optionJson);
                    },
                });

                //put question status
                const questionJson = JSON.stringify({
                    id: app.questionWrongList[i],
                    approvalStatusId: status,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Questions/ApprovalStatus",
                    method: "PUT",
                    data: questionJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {},
                });
            }

            const testJson = JSON.stringify({
                id: app.testId,
                approvalStatusId: status,
            });

            $.ajax({
                url: "https://questionapi-docker.funday.asia:9010/api/Tests/UpdateApprovalStatus",
                method: "PUT",
                data: testJson,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: async function (res) {
                    // console.log(res);
                },
            });

            app.checkPop = false;
            app.deniedPop = false;
            setTimeout(() => {
                app.status = status;
                app.getExamList(status);
            }, 1000);
        },

        copyTest(id, testName, schoolYearId, duration, testTypeId) {
            //get questions id
            let qsList = [];
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests/Details/${id}
        `,
                method: "GET",
                success: function (res) {
                    res.questions.forEach((item) => {
                        if (item.approvalStatusId === 2) {
                            qsList.push(item.id);
                        }
                    });
                    changeName();
                    createNewTest();
                },
            });

            // change test name - rejected
            function changeName() {
                if (qsList.length === 0) {
                    alert("此考卷題目皆已下架，無法複製");
                    return;
                }
                const nameJson = JSON.stringify({
                    id: id,
                    testName: `${testName}-下架`,
                });
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Tests/UpdateTestName
                        `,
                    method: "PUT",
                    data: nameJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        console.log(res);
                    },
                });
            }

            //create test and use same name
            function createNewTest() {
                const json = JSON.stringify({
                    subjectId: app.nowSubject,
                    testTypeId: testTypeId,
                    schoolYearId: schoolYearId,
                    testName: testName,
                    duration: duration,
                });
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Tests
                        `,
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        qsList.forEach((item) => {
                            joinQuestionToTest(res.id, item);
                        });
                    },
                });
            }

            //join question to new test
            function joinQuestionToTest(testId, qsId) {
                const json = JSON.stringify({
                    testId: testId,
                    questionId: qsId,
                });
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/TestQuestions
                        `,
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        setTimeout(() => {
                            app.status = 0;
                            app.getExamList(0);
                        }, 1000);
                    },
                });
            }
        },
    },
});
