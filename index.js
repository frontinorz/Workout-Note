const data = [
    {
        muscle: '背肌',
        exercises: '啞鈴划船',
        readonly: true,
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
        readonly: true,
        isVideo: false,
        note: "筆記一"
    },
    {
        muscle: '肩膀',
        exercises: '啞鈴側舉',
        readonly: true,
        isVideo: false
    },
    {
        muscle: '腹肌',
        exercises: '側體平板',
        readonly: true,
        isVideo: false
    },
    {
        muscle: '肩膀',
        exercises: '啞鈴肩推',
        readonly: true,
        isVideo: false
    },
    {
        muscle: '胸肌',
        exercises: '槓片夾心',
        readonly: true,
        isVideo: false
    },
    {
        muscle: '腹肌',
        exercises: '平板體撐',
        readonly: true,
        isVideo: false
    },
    {
        muscle: '胸肌',
        exercises: '平躺飛鳥',
        readonly: true,
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
                cycle: 3,
                rep: 4,
                time: 0,
            },
            {
                exercises: '啞鈴划船',
                weight: 10,
                cycle: 3,
                rep: 12,
                time: 0,
            },
            {
                exercises: '啞鈴飛鳥',
                weight: 10,
                cycle: 3,
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
                cycle: 3,
                rep: 4,
                time: 0,
            },
            {
                exercises: '平躺啞鈴飛鳥',
                weight: 10,
                cycle: 3,
                rep: 12,
                time: 0,
            },
            {
                exercises: '槓片夾心',
                weight: 4,
                cycle: 3,
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
        isOverlayOpen: false,
        isPlayer: false,
        isSearchResult: true,
        exercisedata: data,
        scheduledata: scheduleList,
        player: {},
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
        tempWeight: "",
        tempCycle: "",
        tempRep: "",
        tempTime: "",
        searchInput: "",
        searchKeyword: ""
    },
    created(){

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
        addEditing() {
            this.isAdd = true;
            this.exercisedata.forEach(data => data.readonly = true);
        },
        addWorkout() {
            let work = {
                muscle: this.tempMuscle,
                exercises: this.tempExercises,
                weight: this.tempWeight,
                cycle: this.tempCycle,
                rep: this.tempRep,
                time: this.tempTime,
                readonly: true
            };
            this.exercisedata.unshift(work);
            this.isAdd = false;
            this.resetInput();
        },
        cancelAddWorkout() {
            this.isAdd = false;
            this.resetInput();
        },
        editWorkout(d) {
            this.exercisedata.forEach(data => { if (data !== d) data.readonly = true; });
            this.isAdd = false;
            d.readonly = !d.readonly;
        },
        editSchedule(d) {
            this.scheduledata.forEach(data => { if (data !== d) data.isEdit = false; });
            d.isEdit = !d.isEdit;
            this.isScheduleEdit = !this.isScheduleEdit;
        },
        deleteWorkout() {
            this.exercisedata.splice(this.exercisedata.indexOf(this.datanow), 1);
            this.isOverlayOpen = false;
        },
        deleteSchedule(d) {
            this.scheduledata.splice(this.scheduledata.indexOf(d), 1);
        },
        deleteScheduleItems(s, a) {
            this.scheduledata[s].list.splice(this.scheduledata[s].list.indexOf(a), 1);
        },
        resetInput() {
            this.tempMuscle = "";
            this.tempExercises = "";
            this.tempWeight = "";
            this.tempCycle = "";
            this.tempRep = "";
            this.tempTime = "";
        },
        overlayOpen(d){
            this.isOverlayOpen = true;
            this.datanow = d;
            this.overlay.title = d.muscle;
            this.overlay.subtitle = d.exercises;
            this.tempNote = d.note;
            this.isPlayer = d.isVideo;
            if(d.isVideo)this.playerSet(d.video.id, d.video.startSec);
        },
        overlayClose() {
            this.isOverlayOpen = false;
            this.datanow.note = this.tempNote;
            this.player.stopVideo();
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
            console.log("START : " + this.datanow.video.startSec);
            this.playerSet(this.datanow.video.id, this.datanow.video.startSec);
            this.tempVideoId = "";
            this.tempStartSec = "";
            this.tempStartMin = "";
        },
        dataTimeTrans() {
            //console.log("SEC : " + this.tempStartSec+1 + " " + "MIN : " + this.tempStartMin);
            this.tempStartSec = parseInt(this.tempStartSec) || 0;
            this.tempStartMin = parseInt(this.tempStartMin) || 0;
            if (this.tempStartSec > 59 || this.tempStartSec < 0) this.tempStartSec = 0;
            if (this.tempStartMin > 59 || this.tempStartMin < 0 ) this.tempStartMin = 0;
            // console.log("SEC : " + this.tempStartSec + " " + "MIN : " + this.tempStartMin);
            return this.tempStartSec + this.tempStartMin * 60;
        },
        dataVideoIdTrans() {
            return this.tempVideoId.replace("https://youtu.be/", "");
        },
        playerInit() {
            setTimeout(() => {
                this.player = new YT.Player('ytplayer', {
                    videoId: 'PEYBotdieQs',
                    'rel': 0
                });
            }, 500);
        },
        playerSet(id, startSec) {
            this.player.cueVideoById(id,startSec);
        },
        playerGetTime() {
            //let time = parseInt(this.player.getCurrentTime());
            this.player.seekTo(42, false);
        },
        searchCard() {
            this.searchKeyword = this.searchInput.trim();
            this.searchInput = "";
        }
    }
});

