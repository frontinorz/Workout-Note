const data = [
    {
        muscle: '背肌',
        exercises: '啞鈴划船',
        isVideo: true,
        video:{
            id: "N3z3DjxXpE4",
            startSec: "184"
        },
        note:""
    },
    {
        muscle: '胸肌',
        exercises: '平躺臥推',
        isVideo: false,
        note: "筆記一"
    },
    {
        muscle: '肩膀',
        exercises: '啞鈴側舉',
        isVideo: false
    },
    {
        muscle: '腹肌',
        exercises: '側體平板',
        isVideo: false
    },
    {
        muscle: '肩膀',
        exercises: '啞鈴肩推',
        isVideo: false
    },
    {
        muscle: '胸肌',
        exercises: '槓片夾心',
        isVideo: false
    },
    {
        muscle: '腹肌',
        exercises: '平板體撐',
        isVideo: false
    },
    {
        muscle: '胸肌',
        exercises: '平躺飛鳥',
        isVideo: false
    }
];
const scheduleList = [
    {
        schedule: '背肌Day',
        isEdit: false,
        list: [
            {
                exercises: '啞鈴硬舉',
                weight: 20,
                set: 3,
                rep: 4,
                time: 0,
            },
            {
                exercises: '啞鈴划船',
                weight: 10,
                set: 3,
                rep: 12,
                time: 0,
            },
            {
                exercises: '啞鈴飛鳥',
                weight: 10,
                set: 3,
                rep: 12,
                time: 0,
            },
        ]
    },
    {
        schedule: '胸肌Day',
        isEdit: false,
        list: [
            {
                exercises: '平躺啞鈴推舉',
                weight: 20,
                set: 3,
                rep: 4,
                time: 0,
            },
            {
                exercises: '平躺啞鈴飛鳥',
                weight: 10,
                set: 3,
                rep: 12,
                time: 0,
            },
            {
                exercises: '槓片夾心',
                weight: 4,
                set: 3,
                rep: 15,
                time: 0,
            },
        ]
    }
];


const app = new Vue({
    el: '#app',
    data: {
        isAdd: false,
        isScheduleEdit: false,
        isScheduleAdd: false,
        isOverlay: false,
        isVideoOverlay: false,
        isPlayer: false,
        isSearchResult: true,
        exercisedata: JSON.parse(localStorage.getItem('exercisedata')) || data,
        scheduledata: JSON.parse(localStorage.getItem('scheduledata')) || scheduleList,
        tempScheduleData: [],
        player: {},
        playerCapture: {},
        overlay:{
            title: "Muscle",
            subtitle: "Exercise"
        },
        datanow: {},
        tempMuscle: "",
        tempExercises: "",
        tempVideoId: "",
        tempStartMin: "",
        tempStartSec: "",
        tempNote: "",
        tempScheduleName: "",
        searchInput: "",
        searchKeyword: ""
    },
    created(){
        document.addEventListener('beforeunload', this.localStore());
    },
    mounted(){
        this.playerInit();
    },
    computed: {
        muscleList() {
            let obj = this.exercisedata.reduce((sum, d) => {
                if (!sum[d.muscle]) sum[d.muscle] = 0;
                return sum;
            }, {});
            let arr = [];
            for (var i in obj) {
                arr.push(i);
            }
            return arr;
        },
        hasPlayer() {
            return this.isPlayer;
        },
        checkVideoId() {
            return /^(https\:\/\/youtu\.be\/)/.test(this.tempVideoId);
        },
        checkAddInput() {
            return (this.tempMuscle !== "" && this.tempExercises !== "");
        },
        searchResualt() {
            if (this.searchKeyword === '') {
                return this.dataSort(this.exercisedata);
            }
            else{
                let temp = this.exercisedata.filter(d => d.muscle.toLowerCase().indexOf(this.searchKeyword) > -1 ||
                                                        d.exercises.toLowerCase().indexOf(this.searchKeyword) > -1 );
                if(temp.length === 0){
                    this.isSearchResult = false;
                    return this.dataSort(this.exercisedata);
                }else{
                    this.isSearchResult = true;
                    return this.dataSort(temp);
                }
            }
        }
    },
    methods: {
        localStore() {
            // localStorage.setItem('exercisedata', JSON.stringify(this.exercisedata));
            // localStorage.setItem('scheduledata', JSON.stringify(this.scheduledata));
        },
        addEditing() {
            this.isAdd = true;
            //this.exercisedata.forEach(data => data.readonly = true);
        },
        addWorkout() {
            let work = {
                muscle: this.tempMuscle,
                exercises: this.tempExercises,
            };
            this.exercisedata.push(work);
            localStorage.setItem('exercisedata', JSON.stringify(this.exercisedata));
            this.isAdd = false;
            this.resetInput();
        },
        searchCard() {
            this.searchKeyword = this.searchInput.trim();
            this.searchInput = "";
        },
        cancelAddWorkout() {
            this.isAdd = false;
            this.resetInput();
        },
        deleteWorkout() {
            this.exercisedata.splice(this.exercisedata.indexOf(this.datanow), 1);
            localStorage.setItem('exercisedata', JSON.stringify(this.exercisedata));
            this.isOverlay = false;
        },
        editWorkout(d) {
            this.exercisedata.forEach(data => { if (data !== d) data.readonly = true; });
            this.isAdd = false;
            d.readonly = !d.readonly;
        },
        scheduleNew() {
            this.isScheduleAdd = true;
        },
        scheduleCancel() {
            this.tempScheduleName = "";
            this.tempScheduleData = [];
            this.isScheduleAdd = false;
        },
        scheduleAdd() {
            if (!this.isScheduleAdd) return;
            this.scheduledata.push({
                schedule: this.tempScheduleName,
                isEdit: false,
                list: this.tempScheduleData
            });
            localStorage.setItem('scheduledata', JSON.stringify(this.scheduledata));
            this.tempScheduleName = "";
            this.tempScheduleData = [];
            this.isScheduleAdd = false;
        },
        scheduleEdit(d) {
            this.scheduledata.forEach(data => { if (data !== d) data.isEdit = false; });
            d.isEdit = !d.isEdit;
            this.isScheduleEdit = !this.isScheduleEdit;
            localStorage.setItem('scheduledata', JSON.stringify(this.scheduledata));
        },
        scheduleDelete(d) {
            this.scheduledata.splice(this.scheduledata.indexOf(d), 1);
            localStorage.setItem('scheduledata', JSON.stringify(this.scheduledata));
        },
        scheduleItemsDelete(s, a) {
            this.scheduledata[s].list.splice(this.scheduledata[s].list.indexOf(a), 1);
            localStorage.setItem('scheduledata', JSON.stringify(this.scheduledata));
        },
        tempScheduleItemsDelete(a) {
            this.tempScheduleData.splice(this.tempScheduleData.indexOf(a), 1);
        },
        scheduleItemsAdd(d) {
            if (!this.isScheduleAdd) return;
            let data = {
                exercises: d.exercises,
                weight: "",
                set: "",
                rep: "",
                time: ""
            };
            this.tempScheduleData.push(data);
        },
        overlayOpen(d){
            this.isOverlay = true;
            this.datanow = d;
            this.overlay.title = d.muscle;
            this.overlay.subtitle = d.exercises;
            this.tempNote = d.note;
            this.isPlayer = d.isVideo;
            if(d.isVideo)this.playerSet(d.video.id, d.video.startSec);
        },
        overlayClose() {
            this.isOverlay = false;
            this.datanow.note = this.tempNote;
            this.player.stopVideo();

            localStorage.setItem('exercisedata', JSON.stringify(this.exercisedata));
        },
        dataSort(data) {
            return data.sort((a, b) => a.muscle.localeCompare(b.muscle, 'zh-Hans-CN', {
                        sensitivity: 'accent'
                    }));
        },
        dataAddVideo() {
            this.datanow.isVideo = true;
            this.isPlayer = this.datanow.isVideo;
            if (!this.datanow.video) this.datanow.video = {};
            this.datanow.video.id = this.dataVideoIdTrans();
            this.datanow.video.startSec = this.dataTimeTrans();
            this.playerSet(this.datanow.video.id, this.datanow.video.startSec);

            this.tempVideoId = "";
            this.tempStartSec = "";
            this.tempStartMin = "";

            localStorage.setItem('exercisedata', JSON.stringify(this.exercisedata));
        },
        dataTimeTrans() {
            this.tempStartSec = parseInt(this.tempStartSec) || 0;
            this.tempStartMin = parseInt(this.tempStartMin) || 0;
            if (this.tempStartSec > 59 || this.tempStartSec < 0) this.tempStartSec = 0;
            if (this.tempStartMin > 59 || this.tempStartMin < 0 ) this.tempStartMin = 0;
            return this.tempStartSec + this.tempStartMin * 60;
        },
        dataVideoIdTrans() {
            return this.tempVideoId.replace("https://youtu.be/", "");
        },
        playerInit() {
            setTimeout(() => {
                this.player = new YT.Player('moreplayer', {
                    videoId: 'PEYBotdieQs',
                    'rel': 0
                });
                this.playerCapture = new YT.Player('captureplayer', {
                    videoId: 'PEYBotdieQs',
                    'rel': 0
                });
            }, 500);
        },
        playerSet(id, startSec) {
            this.player.cueVideoById(id,startSec);
        },
        videoCaptureOpen(){
            this.isVideoOverlay = true;
        },
        videoCaptureClose() {
            this.isVideoOverlay = false;
            this.tempVideoId = "";
            this.playerCapture.stopVideo();
        },
        videoCaptureInput() {
            this.playerCapture.cueVideoById(this.dataVideoIdTrans(), 0);
        },
        videoCaptureAddExercise() {
            let time = parseInt(this.playerCapture.getCurrentTime()) || 0;
            let videoid = this.dataVideoIdTrans();
            console.log(videoid);
            let work = {
                muscle: this.tempMuscle,
                exercises: this.tempExercises,
                isVideo: true,
                video: {
                    id: videoid ,
                    startSec: time
                },
                note: this.tempNote
            };
            this.exercisedata.unshift(work);
            this.tempExercises = "";
            this.tempNote = "";
        },
        resetInput() {
            this.tempMuscle = "";
            this.tempExercises = "";
        },

    }
});

