import Header from "@/components/Header";

import AccountContent from "./components/AccountContent";

const Account = () => {
  return (
    <div 
      className="
        bg-currentBgTheme 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
      "
    >
      <Header className="from-bg-currentBgTheme">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">
            Account Settings
          </h1>
        </div>
      </Header>
      <AccountContent />
    </div>
  )
}

export default Account;
