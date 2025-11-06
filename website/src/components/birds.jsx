export default function FlyingBirds() {
  return (
    <div className="relative overflow-hidden flex items-center justify-center min-h-[35rem]  p-8">
      {/* Background Image Effect */}
      <div 
        
      />
      
      {/* Bird 1 */}
      <div className="absolute top-[20%] -left-[10%] animate-fly-right-one">
        <div 
          className="w-[88px] h-[125px] animate-fly-cycle-one"
          style={{
            backgroundImage: "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg')",
            backgroundSize: 'auto 100%',
            willChange: 'background-position'
          }}
        />
      </div>
      
      {/* Bird 2 */}
      <div className="absolute top-[20%] -left-[10%] animate-fly-right-two">
        <div 
          className="w-[88px] h-[125px] animate-fly-cycle-two"
          style={{
            backgroundImage: "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg')",
            backgroundSize: 'auto 100%',
            willChange: 'background-position'
          }}
        />
      </div>
      
      {/* Bird 3 */}
      <div className="absolute top-[20%] -left-[10%] animate-fly-right-three">
        <div 
          className="w-[88px] h-[125px] animate-fly-cycle-three"
          style={{
            backgroundImage: "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg')",
            backgroundSize: 'auto 100%',
            willChange: 'background-position'
          }}
        />
      </div>
      
      {/* Bird 4 */}
      <div className="absolute top-[20%] -left-[10%] animate-fly-right-four">
        <div 
          className="w-[88px] h-[125px] animate-fly-cycle-four"
          style={{
            backgroundImage: "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg')",
            backgroundSize: 'auto 100%',
            willChange: 'background-position'
          }}
        />
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Arima+Madurai:300');
        
        @keyframes fly-cycle {
          100% {
            background-position: -900px 0;
          }
        }
        
        @keyframes fly-right-one {
          0% {
            transform: scale(0.3) translateX(-10vw);
          }
          10% {
            transform: translateY(2vh) translateX(10vw) scale(0.4);
          }
          20% {
            transform: translateY(0vh) translateX(30vw) scale(0.5);
          }
          30% {
            transform: translateY(4vh) translateX(50vw) scale(0.6);
          }
          40% {
            transform: translateY(2vh) translateX(70vw) scale(0.6);
          }
          50% {
            transform: translateY(0vh) translateX(90vw) scale(0.6);
          }
          60% {
            transform: translateY(0vh) translateX(110vw) scale(0.6);
          }
          100% {
            transform: translateY(0vh) translateX(110vw) scale(0.6);
          }
        }
        
        .animate-fly-cycle-one {
          animation: fly-cycle 1s steps(10) infinite;
          animation-delay: -0.5s;
        }
        
        .animate-fly-cycle-two {
          animation: fly-cycle 0.9s steps(10) infinite;
          animation-delay: -0.75s;
        }
        
        .animate-fly-cycle-three {
          animation: fly-cycle 1.25s steps(10) infinite;
          animation-delay: -0.25s;
        }
        
        .animate-fly-cycle-four {
          animation: fly-cycle 1.1s steps(10) infinite;
          animation-delay: -0.5s;
        }
        
        .animate-fly-right-one {
          animation: fly-right-one 15s linear infinite;
          animation-delay: 0s;
          will-change: transform;
        }
        
        .animate-fly-right-two {
          animation: fly-right-one 16s linear infinite;
          animation-delay: 1s;
          will-change: transform;
        }
        
        .animate-fly-right-three {
          animation: fly-right-one 14.6s linear infinite;
          animation-delay: 9.5s;
          will-change: transform;
        }
        
        .animate-fly-right-four {
          animation: fly-right-one 16s linear infinite;
          animation-delay: 10.25s;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}