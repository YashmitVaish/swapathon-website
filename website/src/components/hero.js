<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/MorphSVGPlugin3.min.js"></script>

<script>
  gsap.registerPlugin(MorphSVGPlugin);

  const tlL = gsap.timeline({ repeat: -1 });
  const tlR = gsap.timeline({ repeat: -1, delay: 0.9 });

  tlL.to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL2" }, "+=0.9")
     .to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL3" }, "+=0.9")
     .to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL4" }, "+=0.9")
     .to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL5" }, "+=0.9")
     .to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL6" }, "+=0.9")
     .to("#samuraiL1", { duration: 1, morphSVG: "#samuraiL1" }, "+=0.9");

  tlR.to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR2" }, "+=0.9")
     .to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR3" }, "+=0.9")
     .to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR4" }, "+=0.9")
     .to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR5" }, "+=0.9")
     .to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR6" }, "+=0.9")
     .to("#samuraiR1", { duration: 1, morphSVG: "#samuraiR1" }, "+=0.9");
</script>
