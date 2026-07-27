// =================================================
// LOTTERY AI MANAGER v2.0
// CAO VAN HOANG
// =================================================


// ===============================
// DATABASE
// ===============================

let history = JSON.parse(
    localStorage.getItem("lotteryHistory")
) || [];

let randomResult = null;


// ===============================
// DOM
// ===============================


const resultList =
document.getElementById("resultList");


const popupAdd =
document.getElementById("popupAdd");


const popupRandom =
document.getElementById("popupRandom");



const btnAdd =
document.getElementById("btnAdd");


const btnRandom =
document.getElementById("btnRandom");


const btnAI =
document.getElementById("btnAI");


const btnStatistic =
document.getElementById("btnStatistic");


const btnImport =
document.getElementById("btnImport");


const btnClear =
document.getElementById("btnClear");



const closePopup =
document.getElementById("closePopup");


const closeRandom =
document.getElementById("closeRandom");



const saveLottery =
document.getElementById("saveLottery");



const startRandom =
document.getElementById("startRandom");


const saveRandom =
document.getElementById("saveRandom");



const importFile =
document.getElementById("importFile");


const search =
document.getElementById("search");




// INPUT


const date =
document.getElementById("date");


const time =
document.getElementById("time");


const n1 =
document.getElementById("n1");


const n2 =
document.getElementById("n2");


const n3 =
document.getElementById("n3");


const n4 =
document.getElementById("n4");


const n5 =
document.getElementById("n5");


const special =
document.getElementById("special");


const jackpot =
document.getElementById("jackpot");




// AI BOX


const hotNumbers =
document.getElementById("hotNumbers");


const coldNumbers =
document.getElementById("coldNumbers");


const aiSuggest =
document.getElementById("aiSuggest");


const aiScore =
document.getElementById("aiScore");




// BALL


const randomBall =
document.querySelectorAll(
"#randomBalls .ball"
);




// ===============================
// SAVE DATABASE
// ===============================


function saveLocal(){

localStorage.setItem(
"lotteryHistory",
JSON.stringify(history)
);

}



// ===============================
// FORMAT MONEY
// ===============================


function formatMoney(value){

return Number(value || 0)
.toLocaleString("vi-VN");

}



// ===============================
// RENDER
// ===============================


function renderLottery(){


resultList.innerHTML="";


if(history.length===0){


resultList.innerHTML=`

<div class="result">

<h2>
Chưa có dữ liệu xổ số
</h2>

</div>

`;

return;

}



history.forEach((item,index)=>{


resultList.innerHTML += `


<div class="result">


<div class="info">

<h3>
${item.date}
</h3>

<span>
${item.time}
</span>

</div>



<div class="numbers">


${item.numbers.map(n=>`

<div class="ball">
${n}
</div>

`).join("")}



<div class="ball special">

${item.special}

</div>


</div>



<div class="money">

${formatMoney(item.jackpot)}

</div>




<div class="action">


<button class="edit"
onclick="editLottery(${index})">

Sửa

</button>



<button class="delete"
onclick="deleteLottery(${index})">

Xóa

</button>



</div>



</div>


`;


});



updateAI();


}



renderLottery();

// =================================================
// POPUP CONTROL
// =================================================


btnAdd.onclick = ()=>{

popupAdd.style.display="flex";

};



closePopup.onclick = ()=>{

popupAdd.style.display="none";

};



btnRandom.onclick = ()=>{

popupRandom.style.display="flex";

};




closeRandom.onclick = ()=>{

popupRandom.style.display="none";

};





// =================================================
// THÊM KỲ QUAY
// =================================================


saveLottery.onclick = ()=>{


let numbers=[

n1.value.padStart(2,"0"),
n2.value.padStart(2,"0"),
n3.value.padStart(2,"0"),
n4.value.padStart(2,"0"),
n5.value.padStart(2,"0")

];



let sp =
special.value.padStart(2,"0");




if(
numbers.includes("") ||
sp===""

){


alert(
"Vui lòng nhập đủ 5 số và số đặc biệt"
);


return;


}




history.unshift({


date:date.value || 
new Date().toLocaleDateString("vi-VN"),


time:
time.value || "13H",


numbers:numbers,


special:sp,


jackpot:
jackpot.value || 0


});




saveLocal();


renderLottery();



popupAdd.style.display="none";


};








// =================================================
// SỬA DỮ LIỆU
// =================================================


window.editLottery=function(index){



let item =
history[index];



date.value=item.date;

time.value=item.time;


n1.value=item.numbers[0];

n2.value=item.numbers[1];

n3.value=item.numbers[2];

n4.value=item.numbers[3];

n5.value=item.numbers[4];


special.value=item.special;


jackpot.value=item.jackpot;



history.splice(index,1);


popupAdd.style.display="flex";


};







// =================================================
// XÓA 1 KỲ
// =================================================


window.deleteLottery=function(index){


if(confirm(
"Bạn muốn xóa kỳ quay này?"
)){


history.splice(index,1);


saveLocal();


renderLottery();


}


};







// =================================================
// AI PHÂN TÍCH SỐ
// =================================================



function analyzeNumbers(){



let score={};



for(let i=1;i<=35;i++){


let n =
String(i)
.padStart(2,"0");


score[n]=0;


}





history.forEach(item=>{


item.numbers.forEach(n=>{


if(score[n]!==undefined){


score[n]+=10;


}


});


});






return score;


}








function analyzeSpecial(){



let score={};



for(let i=1;i<=12;i++){


let n =
String(i)
.padStart(2,"0");


score[n]=0;


}





history.forEach(item=>{


if(score[item.special]!==undefined){


score[item.special]+=10;


}


});



return score;


}







// =================================================
// TẠO BỘ SỐ AI
// =================================================



function weightedRandom(score,count){



let pool=[];



Object.keys(score)
.forEach(num=>{


let weight =
score[num];


if(weight<=0)
weight=1;



for(let i=0;i<weight;i++){


pool.push(num);


}


});




let result=[];



while(result.length<count){



let num =
pool[
Math.floor(
Math.random()*pool.length
)
];



if(!result.includes(num)){


result.push(num);


}



}



return result.sort(
(a,b)=>Number(a)-Number(b)
);



}








function existed(numbers,special){



return history.some(item=>{


return (

JSON.stringify(item.numbers)
===
JSON.stringify(numbers)

&&

item.special===special

);


});


}








function generateLottery(){



let numbers;

let sp;

let retry=0;




do{


numbers =
weightedRandom(
analyzeNumbers(),
5
);



sp =
weightedRandom(
analyzeSpecial(),
1
)[0];



retry++;



}
while(
existed(numbers,sp)
&& retry<100
);



return {


numbers:numbers,

special:sp


};



}







// =================================================
// CẬP NHẬT AI BOX
// =================================================


function updateAI(){


if(history.length===0){


hotNumbers.innerHTML=
"Chưa có";


coldNumbers.innerHTML=
"Chưa có";


aiSuggest.innerHTML=
"Chưa quay";


aiScore.innerHTML=
"0/100";


return;


}




let score =
analyzeNumbers();




let sorted =
Object.entries(score)
.sort(
(a,b)=>b[1]-a[1]
);





hotNumbers.innerHTML =
sorted
.slice(0,5)
.map(x=>x[0])
.join(" - ");





coldNumbers.innerHTML =
sorted
.slice(-5)
.map(x=>x[0])
.join(" - ");





let ai =
generateLottery();




aiSuggest.innerHTML =

ai.numbers.join(" ")
+
" ⭐ "
+
ai.special;





aiScore.innerHTML =
Math.min(
100,
history.length*5
)
+
"/100";



}








// =================================================
// QUAY SỐ AI
// =================================================


function animateBall(
ball,
callback,
specialBall=false
){


let count=0;


let max =
specialBall ? 12 : 35;



let timer =
setInterval(()=>{


let num =
Math.floor(
Math.random()*max
)+1;



ball.innerHTML =
String(num)
.padStart(2,"0");



count++;



if(count>20){


clearInterval(timer);


callback();


}



},60);


}







startRandom.onclick=()=>{



randomResult =
generateLottery();



let index=0;




function next(){



if(index<5){



animateBall(
randomBall[index],
()=>{


randomBall[index].innerHTML =
randomResult.numbers[index];


index++;


next();


}

);



}
else{



animateBall(
randomBall[5],
()=>{


randomBall[5].innerHTML =
randomResult.special;


},
true
);



}



}



next();



};





// =================================================
// LƯU KẾT QUẢ QUAY
// =================================================


saveRandom.onclick=()=>{


if(!randomResult){

alert(
"Chưa có kết quả quay"
);

return;

}




history.unshift({


date:
new Date()
.toLocaleDateString("vi-VN"),


time:
new Date()
.getHours()
+"H",


numbers:
randomResult.numbers,


special:
randomResult.special,


jackpot:0



});



saveLocal();


renderLottery();


popupRandom.style.display="none";


};

// =================================================
// IMPORT DỮ LIỆU
// =================================================


btnImport.onclick = ()=>{

importFile.click();

};




importFile.onchange = (e)=>{


let file =
e.target.files[0];


if(!file)
return;



let reader =
new FileReader();




reader.onload = ()=>{


let rows =
reader.result
.split("\n")
.map(x=>x.trim())
.filter(x=>x);



let data=[];



for(let i=0;i<rows.length;i+=4){



if(!rows[i+3])
break;




let arr =
rows[i+2]
.split(" ");




data.push({


date:rows[i],


time:rows[i+1],


numbers:
arr.slice(0,5),


special:
arr[5],


jackpot:
rows[i+3]



});



}





if(data.length){



history=data;


saveLocal();


renderLottery();



alert(
"✅ Import thành công "+data.length+" kỳ quay"
);



}


};



reader.readAsText(file);



};








// =================================================
// EXPORT DỮ LIỆU
// =================================================



function exportLottery(){



let text="";



history.forEach(item=>{


text += item.date+"\n";


text += item.time+"\n";


text +=
item.numbers.join(" ")
+
" "
+
item.special
+
"\n";


text += item.jackpot+"\n";


text += "-----\n";


});




let blob =
new Blob(
[text],
{
type:"text/plain;charset=utf-8"
}
);




let link =
document.createElement("a");



link.href =
URL.createObjectURL(blob);



link.download =
"LotteryAI_Data.txt";



link.click();



}




// =================================================
// THÊM NÚT EXPORT TỰ ĐỘNG
// =================================================



let btnExport =
document.getElementById("btnExport");



if(btnExport){


btnExport.onclick =
exportLottery;


}









// =================================================
// TÌM KIẾM
// =================================================


search.oninput=function(){



let keyword =
this.value
.toLowerCase();



document
.querySelectorAll(".result")
.forEach(item=>{


let text =
item.innerText
.toLowerCase();



if(text.includes(keyword)){


item.style.display="flex";


}else{


item.style.display="none";


}



});



};








// =================================================
// THỐNG KÊ
// =================================================



btnStatistic.onclick = ()=>{



if(history.length===0){


alert(
"Chưa có dữ liệu để thống kê"
);


return;


}




let score =
analyzeNumbers();




let top =
Object.entries(score)
.sort(
(a,b)=>b[1]-a[1]
)
.slice(0,10);





let text =
"📊 TOP 10 SỐ XUẤT HIỆN NHIỀU\n\n";



top.forEach((item,index)=>{


text +=

(index+1)
+
". Số "
+
item[0]
+
" - điểm "
+
item[1]
+
"\n";


});




alert(text);



};








// =================================================
// AI DỰ ĐOÁN
// =================================================



btnAI.onclick = ()=>{



let result =
generateLottery();



alert(

"🤖 AI ĐỀ XUẤT BỘ SỐ\n\n"+

result.numbers.join(" - ")

+

"\n⭐ Đặc biệt: "

+

result.special

+

"\n\nĐiểm AI: "

+

Math.floor(
Math.random()*30+70
)

+

"/100"

);



};









// =================================================
// XÓA TOÀN BỘ DỮ LIỆU
// =================================================



const DELETE_PASSWORD_HASH =

"5b6ba13f79129a74a3e819b78e36b922";






btnClear.onclick=()=>{





let password =
prompt(
"🔐 Nhập mật khẩu Admin:"
);





if(password===null)
return;





if(
typeof CryptoJS==="undefined"
){


alert(
"Lỗi bảo mật CryptoJS"
);


return;


}







let hash =
CryptoJS
.MD5(password)
.toString();






if(hash!==DELETE_PASSWORD_HASH){


alert(
"❌ Sai mật khẩu!"
);


return;


}







let ok =
confirm(
"⚠️ Xóa toàn bộ dữ liệu xổ số?"
);




if(!ok)
return;






history=[];



localStorage.removeItem(
"lotteryHistory"
);




renderLottery();



alert(
"✅ Đã xóa toàn bộ dữ liệu"
);



};









// =================================================
// KHỞI ĐỘNG
// =================================================



updateAI();



console.log(
"🎲 Lottery AI Manager v2.0 Loaded"
);