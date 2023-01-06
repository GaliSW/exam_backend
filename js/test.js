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
    },
    created() {
        this.getExamList(1);
        this.concatName();
    },
    methods: {
        concatName() {
            const year = document.getElementById("year").value;
            let chSemester;
            switch (Number(document.getElementById("semester").value)) {
                case 0:
                    chSemester = "(素養)";
                    break;
                case 1:
                    chSemester = "(七上)";
                    break;
                case 2:
                    chSemester = "(七下)";
                    break;
                case 3:
                    chSemester = "(八上)";
                    break;
                case 4:
                    chSemester = "(八下)";
                    break;
                case 5:
                    chSemester = "(九上)";
                    break;
                case 6:
                    chSemester = "(九下)";
                    break;
                case 7:
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

        getExamList() {
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests?SubjectId=${this.nowSubject}&SemesterId=${this.nowSemester}&PageNumber=1&PageSize=20
        `,
                method: "GET",
                success: function (res) {
                    app.testList = res;
                },
            });
        },

        subjectChange(e) {
            this.nowSubject = e.target.value;
            this.getExamList();
        },

        statusChange(e) {
            this.status = Number(e.target.value);
        },

        gradeChange(e) {
            this.nowSemester = e.target.value;
            this.getExamList();
            //     $.ajax({
            //         url: `https://questionapi-docker.funday.asia:9010/api/Tests?SubjectId=${this.nowSubject}&SemesterId=${e.target.value}&PageNumber=1&PageSize=20
            // `,
            //         method: "GET",
            //         success: function (res) {
            //             app.testList = res;
            //         },
            //     });
        },

        getExamContent(id, status) {
            app.single = [];
            app.group = [];
            app.boolean = [];
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Tests/Details/${id}
        `,
                method: "GET",
                success: function (res) {
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
        },

        createTest() {
            const year = document.getElementById("year").value;
            const semester = document.getElementById("semester").value;
            const subject = document.getElementById("subject").value;
            const type = document.getElementById("test_type").value;
            const source = document.getElementById("source").value;
            const range = document.getElementById("range").value;
            const grade = document.getElementById("grade").value;
            const time = document.getElementById("time").value;
            if (
                year == "" ||
                semester == "" ||
                subject == "" ||
                type == "" ||
                source == "" ||
                range == "" ||
                time == "" ||
                grade == ""
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
                        console.log(res);
                    },
                });

                const url = "http://127.0.0.1:5579/questions.html";
                location.href =
                    url + `?testName=${app.testName}&subject=${app.subjectId}`;
            }
        },

        editTest(name, id) {
            const url = "http://127.0.0.1:5579/questions.html";
            location.href =
                url +
                `?testName=${name}&subject=${app.nowSubject}&testId=${id}`;
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
                        app.getExamList(app.nowSubject);
                    },
                });
            }
        },
    },
});
