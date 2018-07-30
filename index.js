const data = [
    {
        muscle: '背肌',
        exercises: '啞鈴划船',
        weight: 10,
        cycle: 3,
        rep: 12,
        time: 0,
        readonly: true,
        isVideo: true,
        video:{
            id: "N3z3DjxXpE4",
            startSec: "184"
        }
    },
    {
        muscle: '胸肌',
        exercises: '平躺臥推',
        weight: 20,
        cycle: 4,
        rep: 3,
        time: 0,
        readonly: true,
        isVideo: false
    },
    {
        muscle: '肩膀',
        exercises: '啞鈴側舉',
        weight: 10,
        cycle: 3,
        rep: 8,
        time: 0,
        readonly: true,
        isVideo: false
    },
    {
        muscle: '腹肌',
        exercises: '平板體撐',
        weight: 0,
        cycle: 3,
        rep: 0,
        time: 50,
        readonly: true,
        isVideo: false
    },
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
        tempMuscle: "",
        tempExercises: "",
        tempWeight: "",
        tempCycle: "",
        tempRep: "",
        tempTime: "",
        isAdd: false,
        isScheduleEdit: false,
        isOverlayOpen: true,
        isPlayer: true,
        exercisedata: data,
        scheduledata: scheduleList,
        player: {},
        overlay:{
            title: "Muscle",
            subtitle: "Exercise"
        }
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
        deleteWorkout(d) {
            this.exercisedata.splice(this.exercisedata.indexOf(d), 1);
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
            this.overlay.title = d.muscle;
            this.overlay.subtitle = d.exercises;
            this.isPlayer = d.isVideo;
            if(d.isVideo)this.playerSet(d.video.id, d.video.startSec);
        },
        overlayClose() {
            this.isOverlayOpen = false;
            this.player.stopVideo();
        },
        playerInit(){
            setTimeout(() => {
                console.log("init");
                this.player = new YT.Player('ytplayer', {
                    //startSeconds: 5,
                    videoId: 'PEYBotdieQs',
                    'rel': 0
                });
            }, 500);
        },
        playerSet(id, startSec){
            this.player.cueVideoById(id,startSec);
        },
        playerGetTime(){
            //let time = parseInt(this.player.getCurrentTime());
            this.player.seekTo(42, false);
        }
    }
});

