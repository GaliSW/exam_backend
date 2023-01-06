let app = new Vue({
    el: "#app",
    data: {
        pop: false,
        isEdit: false,
        infoPop: false,
        popType: 0,
        popTitle: "單選題",
        testName: "",
        subject: "",
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
    },
    created() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const name = urlParams.get("testName");
        const subject = Number(urlParams.get("subject"));
        const testId = urlParams.get("testId");
        this.testName = name;
        this.subject = this.subjectTrans(subject);
        this.getLearningPoints(subject);
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
            this.pop = true;
            this.popType = type;
        },

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
                optionId: 0,
                questionOptionId: 0,
                questionOptionDetailId: 0,
                questionPictureTypeId: 0,
                optionNumber: 0,
                fileName: e.target.files[0].name,
                createAt: new Date().toISOString(),
                purpose: "",
                createBy: "",
                photoBytes: "",
                questionGuid: "",
                questionOptionGuid: "",
                questionOptionDetailGuid: "",
            };
            switch (typeId) {
                case 1:
                    app.questionObj.pictures = [];
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.questionObj.id;
                    if (!app.isEdit) {
                        pictureObj.questionGuid = app.createGuid();
                    }
                    app.questionObj.pictures.push(pictureObj);
                    break;
                case 2:
                    app.questionObj.questionOptions[index].optionPictures = [];
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.questionObj.id;
                    pictureObj.optionId = opId;
                    pictureObj.optionNumber = index + 1; //1 2 3 4
                    if (!app.isEdit) {
                        pictureObj.questionOptionGuid = app.createGuid();
                    }
                    app.questionObj.questionOptions[index].optionPictures.push(
                        pictureObj
                    );
                    break;
                default: //3 4 5 6
                    app.questionObj.questionOptions[index].optionDetails[
                        deIndex
                    ].optionDetailsPictures = [];
                    pictureObj.questionPictureTypeId = typeId;
                    pictureObj.questionId = app.questionObj.id;
                    pictureObj.optionId = opId;
                    pictureObj.questionOptionDetailId = deId;
                    pictureObj.optionNumber = index + 1;
                    pictureObj.optionNumber = typeId - 2;
                    if (!app.isEdit) {
                        pictureObj.questionOptionDetailGuid = app.createGuid();
                    }
                    app.questionObj.questionOptions[index].optionDetails[
                        deIndex
                    ].optionDetailsPictures.push(pictureObj);
            }
        },

        addChapter(id) {
            if (document.querySelectorAll(".chapter_item").length >= 3) return;
            app.questionObj.questionChapters.push({
                chapter: 0,
                questionId: id,
                section: 0,
                updateAt: null,
                updateBy: null,
            });
        },

        removeChapter(e) {
            const item = document.querySelector(".chapter_item");
            if (item) {
                app.questionObj.questionChapters.pop();
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
            if (app.questionObj.learningPoints.length > 4) {
                app.learningList = false;
                return;
            } else if (app.questionObj.learningPoints.length > 0) {
                const arr = app.questionObj.learningPoints;
                const result = arr.find(
                    ({ learningPointId }) => learningPointId === id
                );
                if (result !== undefined) {
                    app.learningList = false;
                    return;
                }
            }

            const obj = {
                id: 0,
                learningPoint: text,
                learningPointId: id,
                questionId: app.questionObj.id,
            };
            app.questionObj.learningPoints.push(obj);
            document.getElementById("points").value = "";
            app.learningList = false;
        },

        removePoint(index) {
            app.questionObj.learningPoints.splice(index, 1);
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
        },

        getQuestionContent(id, type, status) {
            this.questionObj = {};

            $.ajax({
                url: `https://questionapi-docker.funday.asia:9010/api/Questions/toEdit/${id}
                `,
                method: "GET",
                success: function (res) {
                    app.questionObj = res;
                },
            });
            if (status === 0) {
                app.infoPop = true;
            } else {
                this.isEdit = true;
                app.popType = type;
                app.pop = true;
            }
        },

        saveQuestion(status) {
            const json = JSON.stringify(app.questionObj);
            console.log(status);
            if (status === 0) {
                //更新
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Questions/${app.questionObj.id}
                        `,
                    method: "PUT",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                });
                app.getExamContent(app.testId);
                app.pop = false;
            } else {
                $.ajax({
                    url: `https://questionapi-docker.funday.asia:9010/api/Questions
                        `,
                    method: "POST",
                    data: json,
                    dataType: "json",
                    contentType: "application/json;charset=utf-8",
                    success: function (res) {
                        console.log(res);
                        app.setQuestionToTest(res.id);
                    },
                });
            }
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
                    app.getExamContent(app.testId);
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
    },
});
