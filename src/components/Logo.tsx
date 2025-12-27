import logo from "@/assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="PetServices Logo" className="h-24 w-auto" />
    </div>
  );
};

export default Logo;
