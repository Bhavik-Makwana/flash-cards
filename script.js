$(document).ready(function () {
    $(".button-flip").on("click", function() {
        let transform = $(".flex-cards").css("transform");
        console.log(transform);
        // $(".flex-cards").css("transform", "rotateY(180deg)");
        if (transform === "matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)" || transform == undefined)  {
            $(".flex-cards").css("transform", "rotateY(0deg)");
        } else {
            $(".flex-cards").css("transform", "rotateY(180deg)");
        }
    })
   
});