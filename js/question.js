let app = new Vue({
    el: "#app",
    data: {
        pop: false,
        isEdit: false,
        infoPop: false,
        addPop: false,
        popType: 0,
        popTitle: "單選題",
        testName: "",
        subjectId: 0,
        testId: 0,
        subject: "",
        grade: 0,
        approveStatus: 0,
        learningList: false,
        learningPointsList: [],
        chooseLearningPoints: [],
        singleList: [],
        groupList: [],
        booleanList: [],
        questionCount: 0,
        questionList: [],
        questionInfo: {},
        questionObj: {},
        deletePop: {
            isOpen: false,
            name: "",
            id: 0,
        },
        testQuestion: "",
        imgNameList: [], //圖檔名稱
        mainQuestion: {
            question: "",
            answer: "",
            explanation: "",
            difficulty: 0,
            publisherId: 0,
            subjectId: 0,
            semesterId: 0,
            questionTypeId: 0,
            comments: "",
            source: "",
            素養題: false,
            mediaFolder: "",
            translation: "",
            approvalStatusId: 0,
        },
        subQuestion: [
            {
                questionId: 0,
                optionAnalysis: "",
                optionNumber: 1,
                option: "",
                optionAnswer: "",
                optionQuestion: "",
                optionTranslation: "",
                approvalStatusId: 0,
                comments: "",
            },
        ],
        options: [
            [
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "A",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "B",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "C",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "D",
                },
            ],
        ],
        booleanOption: [
            [
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "是",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "非",
                },
            ],
        ],
        mainPictures: [],
        subPictures: [],
        optionPictures: [],
        chapters: [],
        learningPoints: [],
        questionId: 0,
    },
    created() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const name = urlParams.get("testName");
        this.subjectId = Number(urlParams.get("subject"));
        const testId = urlParams.get("testId");
        this.grade = Number(urlParams.get("grade"));
        this.approveStatus = Number(urlParams.get("status"));
        this.testName = name;
        this.subject = this.subjectTrans(this.subjectId);
        this.getLearningPoints(this.subjectId);
        if (testId) {
            this.testId = testId;
            this.getExamContent(testId);
        }
    },
    watch: {
        popType: function (newValue, oldValue) {
            switch (newValue) {
                case 1:
                    this.popTitle = "單選題";
                    break;
                case 2:
                    this.popTitle = "題組";
                    break;
                case 4:
                    this.popTitle = "是非題";
                    break;
            }
        },
        testQuestion: function (newValue, oldValue) {
            app.questionObj.questionOptions[0].optionQuestion =
                encodeURI(newValue);
        },
    },
    methods: {
        create(type) {
            this.isEdit = false;
            this.initQuestionObj(type);
            this.initQuestion(type);
            this.pop = true;
            this.popType = type;
        },

        //for empty form
        initQuestionObj(type) {
            this.questionObj = {
                approvalStatusId: 0,
                id: 0,
                updateAt: null,
                updateBy: null,
                photoBytes: null,
                audioBytes: null,
                questionOptions: [
                    {
                        questionId: 0,
                        updateAt: null,
                        updateBy: null,
                        optionPhotoBytes: null,
                        optionAudioBytes: null,
                        id: null,
                        details: [],
                        optionDetails: [
                            {
                                id: 0,
                                optionDetailsPictures: [],
                                optionDetailsAudios: [],
                                questionOptionId: 0,
                                optionDetails: "",
                                optionPhoto: null,
                                optionAudio: null,
                                optionDetailAnalysis: null,
                                option: "A",
                            },
                            {
                                id: 0,
                                optionDetailsPictures: [],
                                optionDetailsAudios: [],
                                questionOptionId: 0,
                                optionDetails: "",
                                optionPhoto: null,
                                optionAudio: null,
                                optionDetailAnalysis: null,
                                option: "B",
                            },
                            {
                                id: 0,
                                optionDetailsPictures: [],
                                optionDetailsAudios: [],
                                questionOptionId: 0,
                                optionDetails: "",
                                optionPhoto: null,
                                optionAudio: null,
                                optionDetailAnalysis: null,
                                option: "C",
                            },
                            {
                                id: 0,
                                optionDetailsPictures: [],
                                optionDetailsAudios: [],
                                questionOptionId: 0,
                                optionDetails: "",
                                optionPhoto: null,
                                optionAudio: null,
                                optionDetailAnalysis: null,
                                option: "D",
                            },
                        ],
                        optionPictures: [],
                        optionAnalysis: "",
                        optionNumber: 1,
                        option: null,
                        optionAnswer: "",
                        optionQuestion: "",
                        optionTranslation: "",
                    },
                ],
                questionChapters: [],
                pictures: [],
                questionLearningPoints: [],
                audios: [],
                questionPictures: [],
                // questionPictures: [
                //     {
                //         id: 434,
                //         questionId: 1455,
                //         optionId: 0,
                //         questionOptionId: null,
                //         questionOptionDetailId: null,
                //         questionPictureTypeId: 1,
                //         optionNumber: null,
                //         fileName:
                //             "",
                //     },
                // ],
                questionAudios: [],
                learningPoints: [],
                question: "",
                answer: "",
                explanation: "",
                learningPointId: null,
                learningPoint: null,
                difficulty: 1,
                publisherId: 1,
                subjectId: 1,
                semesterId: null,
                questionTypeId: type,
                chapter: null,
                section: null,
                source: "",
                photo: null,
                audio: null,
                素養題: null,
                mediaFolder: app.testName,
                translation: "",
            };
        },

        //for object store
        initQuestion(type) {
            app.mainQuestion = {
                question: "",
                answer: "",
                explanation: "",
                difficulty: 0,
                publisherId: 0,
                subjectId: app.subjectId,
                semesterId: 0,
                questionTypeId: type,
                comments: "",
                source: "",
                素養題: false,
                mediaFolder: "",
                translation: "",
                approvalStatusId: 0,
            };
            app.subQuestion = [
                {
                    questionId: 0,
                    optionAnalysis: "",
                    optionNumber: 1,
                    option: "",
                    optionAnswer: "",
                    optionQuestion: "",
                    optionTranslation: "",
                    approvalStatusId: 0,
                    comments: "",
                },
            ];
            app.options = [
                [
                    {
                        questionOptionId: 0,
                        optionDetails: "",
                        optionDetailAnalysis: "",
                        option: "A",
                    },
                    {
                        questionOptionId: 0,
                        optionDetails: "",
                        optionDetailAnalysis: "",
                        option: "B",
                    },
                    {
                        questionOptionId: 0,
                        optionDetails: "",
                        optionDetailAnalysis: "",
                        option: "C",
                    },
                    {
                        questionOptionId: 0,
                        optionDetails: "",
                        optionDetailAnalysis: "",
                        option: "D",
                    },
                ],
            ];
            app.chapters = [];
            app.learningPoints = [];
            app.subPictures = [[]];
            app.optionPictures = [[]];
        },

        imgPreview(e, typeId, opId, index, deId, deIndex) {
            this.createImgObj(e, typeId, opId, index, deId, deIndex);
            const blk = e.target.parentNode;
            const img = document.createElement("img");
            //preview
            if (e.target.files && e.target.files[0]) {
                let reader = new FileReader();

                reader.onload = function (e) {
                    img.src = e.target.result;
                }.bind(this);

                reader.readAsDataURL(event.target.files[0]);
            }
            if (blk.getElementsByTagName("img").length === 1) {
                blk.getElementsByTagName("img")[0].remove();
                blk.appendChild(img);
            } else {
                blk.appendChild(img);
            }
        },

        createImgObj(e, typeId, opId, index, deId, deIndex) {
            let pictureObj = {
                questionId: 0,
                questionOptionId: 0,
                questionOptionDetailId: 0,
                questionPictureTypeId: 0,
                optionNumber: 0,
                fileName: e.target.files[0].name,
                files: e.target.files[0],
            };
            console.log(pictureObj);
            switch (typeId) {
                case 1: //main
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.mainQuestion.id;
                    app.mainPictures = [];
                    app.mainPicturesFiles = [];
                    app.mainPictures.push(pictureObj);
                    if (app.isEdit) {
                        app.putPictures(pictureObj, app.mainQuestion.id, 1);
                    }
                    break;
                case 2: //sub
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.mainQuestion.id;
                    pictureObj.questionOptionId = opId;
                    pictureObj.optionNumber = index + 1; //1 2 3 4
                    let subIndex = app.subPictures.findIndex((el) => {
                        return el.optionNumber == index + 1;
                    });
                    if (subIndex > -1) {
                        app.subPictures[index].splice(subIndex, 1);
                    }
                    app.subPictures[index].push(pictureObj);
                    console.log(pictureObj);
                    if (app.isEdit) {
                        app.putPictures(
                            pictureObj,
                            app.mainQuestion.id,
                            2,
                            index
                        );
                    }
                    break;
                default: //3 4 5 6 details
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.mainQuestion.id;
                    pictureObj.questionOptionId = opId;
                    pictureObj.questionOptionDetailId = index + 1;
                    pictureObj.optionNumber = deIndex + 1;
                    let optionIndex = app.optionPictures[index].findIndex(
                        (el) => {
                            return (
                                el.questionOptionDetailId == index + 1 &&
                                el.optionNumber == deIndex + 1
                            );
                        }
                    );
                    if (optionIndex > -1) {
                        app.optionPictures[index].splice(optionIndex, 1);
                    }
                    app.optionPictures[index].push(pictureObj);
                    if (app.isEdit) {
                        app.putPictures(
                            pictureObj,
                            app.mainQuestion.id,
                            3,
                            index,
                            deIndex
                        );
                    }
                    console.log(pictureObj);
            }
        },

        //edit pictures
        putPictures(item, qsId, type, opIndex, deIndex) {
            return new Promise((resolve, reject) => {
                // if (app.questionObj.questionPictures[0] == undefined) {
                //     uploadFiles();
                // } else {
                //     item.id = app.questionObj.questionPictures[0].id;
                //     // delete original file
                //     $.ajax({
                //         url: `https://questionapi-docker.funday.asia:9010/api/Files/${item.id}`,
                //         method: "DELETE",
                //         success: function (res) {
                //             console.log(res, item);
                //         },
                //     });
                // }
                switch (type) {
                    case 1:
                        if (app.questionObj.questionPictures[0] == undefined) {
                            item.id = 0;
                            console.log("1");
                            uploadFiles();
                        } else {
                            item.id = app.questionObj.questionPictures[0].id;
                            console.log("2");
                            uploadFiles();
                        }
                        break;
                    case 2:
                        if (
                            app.questionObj.questionOptions[opIndex]
                                .optionPictures[0] == undefined
                        ) {
                            item.id = 0;
                            uploadFiles();
                        } else {
                            item.id =
                                app.questionObj.questionOptions[
                                    opIndex
                                ].optionPictures[0].id;
                            uploadFiles();
                        }
                        break;
                    case 3:
                        if (
                            app.questionObj.questionOptions[opIndex]
                                .optionDetails[deIndex]
                                .optionDetailsPictures[0] == undefined
                        ) {
                            item.questionOptionDetailId =
                                app.questionObj.questionOptions[
                                    opIndex
                                ].optionDetails[deIndex].id;
                            item.id = 0;
                            uploadFiles();
                        } else {
                            item.id =
                                app.questionObj.questionOptions[
                                    opIndex
                                ].optionDetails[
                                    deIndex
                                ].optionDetailsPictures[0].id;
                            item.questionOptionDetailId =
                                app.questionObj.questionOptions[
                                    opIndex
                                ].optionDetails[deIndex].id;
                            uploadFiles();
                        }
                        break;
                }

                //uploadFiles
                function uploadFiles() {
                    const formData = new FormData();
                    formData.append("file", item.files);
                    console.log(item.fileName);
                    $.ajax({
                        url: `https://questionapi-docker.funday.asia:9010/api/Files?folderName=${qsId}&fileName=${item.fileName}`,
                        method: "POST",
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        data: formData,
                        success: function (res) {
                            console.log(res);
                            postFileName();
                        },
                    });
                }

                // put fileName
                function postFileName() {
                    delete item["files"];
                    const name = `${qsId}/${item.fileName}`;
                    item.fileName = name;
                    console.log(item.fileName);
                    // item.id = app.questionObj.questionPictures[0].id;
                    const json = JSON.stringify(item);
                    $.ajax({
                        url: "https://questionapi-docker.funday.asia:9010/api/QuestionPictures",
                        method: "PUT",
                        data: json,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function (res) {
                            console.log(res, item);
                            resolve();
                        },
                    });
                }
            });
        },

        addChapter(id) {
            if (document.querySelectorAll(".chapter_item").length >= 3) return;
            app.chapters.push({
                questionId: 0,
                chapter: 0,
                section: 0,
            });
        },

        removeChapter(e) {
            const item = document.querySelector(".chapter_item");
            if (item) {
                app.chapters.pop();
            } else {
                return;
            }
        },

        getLearningPoints(subject) {
            $.ajax({
                url: `https://teachersayapi-docker.funday.asia:9010/api/LearningPoints/SelectList?subjectId=${subject}
                `,
                method: "GET",
                success: function (res) {
                    app.learningPointsList = res;
                },
            });
        },

        searchLeaningPoints(e) {
            app.learningPointsList = [];
            app.learningList = true;
            const text = e.target.value;

            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/LearningPoints?searchText=${text}&page=1&pageSize=10
                `,
                method: "GET",
                success: function (res) {
                    console.log(res);
                    const arr = res;
                    arr.forEach((item) => {
                        let obj = {
                            id: item.id,
                            text: item.name,
                        };
                        app.learningPointsList.push(obj);
                    });
                },
            });
        },

        getExamContent(id) {
            this.singleList = [];
            this.groupList = [];
            this.booleanList = [];
            $.ajax({
                url: ` https://questionapi-docker.funday.asia:9010/api/Tests/Details/${id}
        `,
                method: "GET",
                success: function (res) {
                    console.log(res);
                    if (res === "") return;
                    const list = res.questions;
                    app.questionCount = res.questionCount;
                    list.forEach(function (item, index) {
                        switch (item.questionTypeId) {
                            case 1:
                                app.singleList.push(item);
                                break;
                            case 2:
                                app.groupList.push(item);
                                break;
                            case 4:
                                app.booleanList.push(item);
                                break;
                        }
                    });
                },
            });
        },

        addPoint(text, id) {
            if (app.learningPoints.length > 4) {
                app.learningList = false;
                return;
            } else if (app.learningPoints.length > 0) {
                const arr = app.learningPoints;
                const result = arr.find(
                    ({ learningPointId }) => learningPointId === id
                );
                if (result !== undefined) {
                    app.learningList = false;
                    return;
                }
            }

            const obj = {
                questionId: 0,
                learningPointId: id,
                learningPoint: text,
            };
            app.learningPoints.push(obj);
            document.getElementById("points").value = "";
            app.learningList = false;
        },

        removePoint(index) {
            app.learningPoints.splice(index, 1);
        },

        addQuestion() {
            const length = app.questionObj.questionOptions.optionNumber;
            app.questionObj.questionOptions.push({
                id: 0,
                optionAnalysis: "",
                optionPictures: [],
                optionQuestion: "",
                optionTranslation: "",
                questionId: 0,
                optionNumber: length + 1,
                optionDetails: [
                    {
                        detailPictures: [],
                        id: 0,
                        optionDetails: "",
                        questionId: 0,
                        option: "A",
                        questionOptionId: 0,
                        optionDetailsPictures: [],
                    },
                    {
                        detailPictures: [],
                        id: 0,
                        optionDetails: "",
                        questionId: 0,
                        option: "B",
                        questionOptionId: 0,
                        optionDetailsPictures: [],
                    },
                    {
                        detailPictures: [],
                        id: 0,
                        optionDetails: "",
                        questionId: 0,
                        option: "C",
                        questionOptionId: 0,
                        optionDetailsPictures: [],
                    },
                    {
                        detailPictures: [],
                        id: 0,
                        optionDetails: "",
                        questionId: 0,
                        option: "D",
                        questionOptionId: 0,
                        optionDetailsPictures: [],
                    },
                ],
            });
            app.subQuestion.push({
                questionId: 0,
                optionAnalysis: "",
                optionNumber: length + 1,
                option: "",
                optionAnswer: "",
                optionQuestion: "",
                optionTranslation: "",
                approvalStatusId: 0,
                comments: "",
            });
            app.options.push([
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "A",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "B",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "C",
                },
                {
                    questionOptionId: 0,
                    optionDetails: "",
                    optionDetailAnalysis: "",
                    option: "D",
                },
            ]);
            app.subPictures.push([]);
            app.optionPictures.push([]);
        },

        addGroupQuestion(id, type) {
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Questions/toEdit/${id}
                `,
                method: "GET",
                success: async function (res) {
                    console.log(res);
                    app.isEdit = false;
                    app.initQuestionObj(type);
                    app.initQuestion(type);
                    app.addPop = true;
                    app.popType = type;
                    app.subQuestion[0].optionNumber =
                        res.questionOptions.length + 1;
                    app.subQuestion[0].questionId = id;
                    app.questionId = id;
                    console.log(app.subQuestion, app.options);
                },
            });
        },

        getQuestionContent(id, type, status) {
            this.questionObj = {};
            this.initQuestion();
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Questions/toEdit/${id}
                `,
                method: "GET",
                success: async function (res) {
                    console.log(res);
                    app.questionObj = res; // question info
                    //edit question
                    app.mainQuestion = {
                        id: res.id,
                        question: res.question,
                        answer: res.answer,
                        explanation: res.explanation,
                        difficulty: res.difficulty,
                        publisherId: res.publisherId,
                        subjectId: res.subjectId,
                        semesterId: res.semesterId,
                        questionTypeId: res.questionTypeId,
                        comments: res.comments,
                        source: res.source,
                        素養題: res.素養題,
                        mediaFolder: res.mediaFolder,
                        translation: res.translation,
                        approvalStatusId: res.approvalStatusId,
                    };
                    app.subQuestion = [];
                    app.options = [];
                    res.questionOptions.forEach((item, index) => {
                        app.subQuestion.push({
                            id: item.id,
                            questionId: item.questionId,
                            optionAnalysis: item.optionAnalysis,
                            optionNumber: item.optionNumber,
                            option: item.option,
                            optionAnswer: item.optionAnswer,
                            optionQuestion: item.optionQuestion,
                            optionTranslation: item.optionTranslation,
                            approvalStatusId: item.approvalStatusId,
                            comments: item.comments,
                        });
                        app.options.push([]);
                        app.optionPictures.push([]);
                        item.optionDetails.forEach((ele) => {
                            app.options[index].push({
                                id: ele.id,
                                questionOptionId: ele.questionOptionId,
                                optionDetails: ele.optionDetails,
                                optionDetailAnalysis: ele.optionDetailAnalysis,
                                option: ele.option,
                            });
                            // app.optionPictures[index].push([]);
                        });
                        app.subPictures.push([]);
                    });
                    res.questionChapters.forEach((item) => {
                        app.chapters.push({
                            questionId: item.questionId,
                            chapter: item.chapter,
                            section: item.section,
                        });
                    });
                    res.learningPoints.forEach((item) => {
                        app.learningPoints.push({
                            questionId: item.questionId,
                            learningPointId: item.learningPointId,
                            text: item.learningPoint,
                        });
                    });
                    app.chapters = res.questionChapters;
                    app.learningPoints = res.learningPoints;
                    if (status === 0) {
                        app.infoPop = true;
                    } else {
                        app.isEdit = true;
                        app.popType = type;
                        app.pop = true;
                    }
                },
            });
        },

        deleteQuestion(status, id) {
            if (status === 0) {
                app.deletePop = {
                    isOpen: true,
                    id: id,
                };
            } else if (status === 1) {
                app.deletePop.isOpen = false;
            } else {
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/TestQuestions/${app.testId}/${app.deletePop.id}
                            `,
                    method: "DELETE",
                    success: function (res) {
                        app.getExamContent(app.testId);
                        app.deletePop.isOpen = false;
                    },
                });
            }
        },

        setQuestionToTest(id) {
            const json = JSON.stringify({
                testId: app.testId,
                questionId: id,
                createAt: new Date().toISOString(),
                createBy: "",
            });
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/TestQuestions
                        `,
                method: "POST",
                data: json,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function () {
                    app.pop = false;
                },
            });
        },

        subjectTrans(id) {
            switch (id) {
                case 1:
                    return "國文";
                case 3:
                    return "英文";
                case 5:
                    return "數學";
                case 7:
                    return "理化";
                case 8:
                    return "生物";
                case 9:
                    return "地科";
                case 11:
                    return "公民";
                case 12:
                    return "地理";
                case 13:
                    return "歷史";
            }
        },

        publisherTrans(id) {
            switch (id) {
                case 1:
                    return "南一";
                case 2:
                    return "康軒";
                case 3:
                    return "翰林";
                case 4:
                    return "自編";
            }
        },

        createGuid() {
            let d = Date.now();
            if (
                typeof performance !== "undefined" &&
                typeof performance.now === "function"
            ) {
                d += performance.now(); //use high-precision timer if available
            }
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
                }
            );
        },

        uploadFile(folderName, fileName) {
            return new Promise((resolve, reject) => {
                console.log(folderName);
                resolve();
            });
        },

        //*====================== create ======================

        async saveQuestion(status) {
            //main
            if (status === 1) {
                //post
                app.postMainQuestion();
            } else if (status === 0) {
                //put
                app.putMainQuestion();
            } else {
                //add question
                await app.postSubQuestion(app.questionId);
                setTimeout(() => {
                    app.addPop = false;
                }, 1000);
            }
        },

        postMainQuestion() {
            app.mainQuestion.questionTypeId = app.popType;
            if (app.mainQuestion.question === "") {
                app.mainQuestion.question = app.subQuestion[0].optionQuestion;
            }
            const json = JSON.stringify(app.mainQuestion);
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Questions/Updated",
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: async function (res) {
                        await app.setQuestionToTest(res.result.id);
                        await app.postSubQuestion(res.result.id);
                        app.postChapter(res.result.id);
                        app.postLearningPoints(res.result.id);
                        await app.postMainPictures(res.result.id);
                        setTimeout(() => {
                            app.pop = false;
                            location.reload();
                        }, 1000);
                    },
                });
            });
        },

        async postSubQuestion(qsId) {
            for (let i = 0; i < app.subQuestion.length; i++) {
                const item = app.subQuestion[i];
                item.questionId = qsId;
                item.optionNumber = i + 1;
                const json = JSON.stringify(item);
                const res = await postContent();

                function postContent() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions",
                            method: "POST",
                            data: json,
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            success: async function (res) {
                                console.log(res);
                                app.postOption(qsId, res.result.id, i);
                                await app.postSubPictures(
                                    qsId,
                                    res.result.id,
                                    i
                                );
                                resolve();
                            },
                        });
                    });
                }
            }
        },

        async postOption(qsId, opId, index) {
            let arr;
            if (app.popType === 4) {
                arr = app.booleanOption;
            } else {
                arr = app.options;
            }

            for (let i = 0; i < arr[index].length; i++) {
                const ele = arr[index][i];
                ele.questionOptionId = opId;
                const json = JSON.stringify(ele);
                const res = await postContent();
                function postContent() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptionDetails",
                            method: "POST",
                            data: json,
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            success: async function (res) {
                                console.log(res);
                                await app.postOptionPictures(
                                    qsId,
                                    opId,
                                    res.result.id,
                                    index,
                                    i
                                );
                                resolve();
                            },
                        });
                    });
                }
            }
        },

        postMainPictures(qsId) {
            return new Promise((resolve, reject) => {
                if (app.mainPictures.length === 0) resolve();
                const item = app.mainPictures[0];
                item.questionId = qsId;
                //uploadFiles
                const formData = new FormData();
                formData.append("file", item.files);
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Files?folderName=${qsId}&fileName=${item.fileName}`,
                    method: "POST",
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    data: formData,
                    success: function (res) {
                        postFileName();
                    },
                });

                // post fileName
                function postFileName() {
                    delete item["files"];
                    const name = `${qsId}/${item.fileName}`;
                    item.fileName = name;
                    const json = JSON.stringify(item);
                    $.ajax({
                        url: "https://questionapi-docker.funday.asia:9010/api/QuestionPictures/Updated",
                        method: "POST",
                        data: json,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function (res) {
                            resolve();
                        },
                    });
                }
            });
        },
        postSubPictures(qsId, opId, index) {
            return new Promise((resolve, reject) => {
                console.log(app.subPictures[index]);
                if (app.subPictures[index][0] == undefined) resolve();
                const item = app.subPictures[index][0];
                console.log(qsId, item);
                item.questionId = qsId;
                item.questionOptionId = opId;
                //uploadFiles
                const formData = new FormData();
                formData.append("file", item.files);
                console.log(formData, item);
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Files?folderName=${qsId}&fileName=${item.fileName}`,
                    method: "POST",
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    data: formData,
                    success: function (res) {
                        console.log(res);
                        postFileName();
                    },
                });

                // post fileName
                function postFileName() {
                    console.log("1");
                    delete item["files"];
                    const name = `${qsId}/${item.fileName}`;
                    item.fileName = name;
                    console.log(item);
                    const json = JSON.stringify(item);
                    $.ajax({
                        url: "https://questionapi-docker.funday.asia:9010/api/QuestionPictures/Updated",
                        method: "POST",
                        data: json,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function (res) {
                            console.log(res);
                            resolve();
                        },
                    });
                }
            });
        },
        postOptionPictures(qsId, opId, deId, index, num) {
            return new Promise((resolve, reject) => {
                if (app.optionPictures[index][num] == undefined) resolve();
                const item = app.optionPictures[index][num];
                item.questionId = qsId;
                item.questionOptionId = opId;
                item.questionOptionDetailId = deId;
                //uploadFiles
                const formData = new FormData();
                formData.append("file", item.files);
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Files?folderName=${qsId}&fileName=${item.fileName}`,
                    method: "POST",
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    data: formData,
                    success: function (res) {
                        postFileName();
                    },
                });

                // post fileName
                function postFileName() {
                    delete item["files"];
                    const name = `${qsId}/${item.fileName}`;
                    item.fileName = name;
                    const json = JSON.stringify(item);
                    $.ajax({
                        url: "https://questionapi-docker.funday.asia:9010/api/QuestionPictures/Updated",
                        method: "POST",
                        data: json,
                        dataType: "json",
                        contentType: "application/json;charset=utf-8",
                        success: function (res) {
                            resolve();
                        },
                    });
                }
            });
        },
        postChapter(qsId) {
            app.chapters.forEach((item) => {
                item.questionId = qsId;
                delete item["text"];
                const json = JSON.stringify(item);
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionChapters",
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {},
                });
            });
        },
        postLearningPoints(qsId) {
            app.learningPoints.forEach((item) => {
                item.questionId = qsId;
                const json = JSON.stringify(item);
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/QuestionLearningPoints/Updated",
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {},
                });
            });
        },

        //* ================= update ====================
        putMainQuestion() {
            if (app.mainQuestion.questionTypeId !== 2) {
                app.mainQuestion.question = app.subQuestion[0].optionQuestion;
            }
            const json = JSON.stringify(app.mainQuestion);
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Questions/Updated",
                    method: "PUT",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: async function (res) {
                        console.log(res);
                        const qsId = res.result.id;
                        await app.putSubQuestion(qsId);
                        app.updateChapter(qsId);
                        app.putLearningPoints(qsId);
                        setTimeout(() => {
                            app.pop = false;
                            location.reload();
                        }, 1000);
                    },
                });
            });
        },

        async putSubQuestion(qsId) {
            for (let i = 0; i < app.subQuestion.length; i++) {
                const item = app.subQuestion[i];
                item.questionId = qsId;
                item.optionNumber = i + 1;
                const json = JSON.stringify(item);
                const res = await postContent();

                function postContent() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions",
                            method: "PUT",
                            data: json,
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            success: async function (res) {
                                app.putOption(qsId, res.result.id, i);
                                app.putApproveStatus(
                                    qsId,
                                    res.result.id,
                                    res.result.approvalStatusId
                                );
                                resolve();
                            },
                        });
                    });
                }
            }
        },

        async putOption(qsId, opId, index) {
            let arr;
            if (app.popType === 4) {
                arr = app.booleanOption;
            } else {
                arr = app.options;
            }

            for (let i = 0; i < arr[index].length; i++) {
                const ele = arr[index][i];
                ele.questionOptionId = opId;
                const json = JSON.stringify(ele);
                const res = await postContent();
                function postContent() {
                    return new Promise((resolve, reject) => {
                        $.ajax({
                            url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptionDetails",
                            method: "PUT",
                            data: json,
                            dataType: "json",
                            contentType: "application/json;charset=utf-8",
                            success: async function (res) {
                                console.log(res);
                                resolve();
                            },
                        });
                    });
                }
            }
        },

        putApproveStatus(qsId, opId, statusId) {
            let status = 0;
            if (statusId === 2) {
                status = 2;
            }
            const optionJson = JSON.stringify({
                id: opId,
                approvalStatusId: status,
            });
            $.ajax({
                url: "https://questionapi-docker.funday.asia:9010/api/QuestionOptions/ApprovalStatus",
                method: "PUT",
                data: optionJson,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    console.log(res);
                },
            });
            const questionJson = JSON.stringify({
                id: qsId,
                approvalStatusId: 0,
            });
            $.ajax({
                url: "https://questionapi-docker.funday.asia:9010/api/Questions/ApprovalStatus",
                method: "PUT",
                data: questionJson,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (res) {
                    console.log(res);
                },
            });
        },

        updateChapter(qsId) {
            //delete
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/QuestionChapters/byQuestion/${qsId}`,
                method: "DELETE",
                success: function (res) {
                    //post new chapter
                    app.postChapter(qsId);
                },
            });
        },

        putLearningPoints(qsId) {
            //delete
            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/QuestionLearningPoints/ByQuestionId/${qsId}`,
                method: "DELETE",
                success: function (res) {
                    //post new learning points
                    app.postLearningPoints(qsId);
                },
            });
        },

        //* ================= update ====================
        recheck() {
            if (document.querySelectorAll(".reject").length > 0) {
                alert("請先訂正所有黃標的題目");
            } else {
                const testJson = JSON.stringify({
                    id: app.testId,
                    approvalStatusId: 0,
                });
                $.ajax({
                    url: "https://questionapi-docker.funday.asia:9010/api/Tests/UpdateApprovalStatus",
                    method: "PUT",
                    data: testJson,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                });
                location.href = "../index.html";
            }
        },
    },
});
