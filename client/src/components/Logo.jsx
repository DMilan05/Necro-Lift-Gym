function Logo() {
  return (
    <h1
      className="text-5xl md:text-7xl text-center py-8 tracking-wide select-none"
      style={{
        fontFamily: "'Butcherman', cursive",
        color: '#8a0303',
        textShadow: `
          0 2px 0 #5c0202,
          0 4px 0 #3d0101,
          0 6px 10px rgba(0,0,0,0.8),
          0 0 45px rgba(138,3,3,0.35)
        `,
      }}
    >
      Necro Lift Gym
    </h1>
  );
}

export default Logo;