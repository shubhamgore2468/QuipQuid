import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 opacity-90">Customize your account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
              <nav className="space-y-1">
                {[
                  { name: "Profile", active: true },
                  { name: "Account" },
                  { name: "Notifications" },
                  { name: "Appearance" },
                  { name: "Security" },
                  { name: "Billing" },
                  { name: "Integrations" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`block px-4 py-2 rounded-md ${
                      item.active
                        ? "bg-purple-50 text-[#6C16C7] dark:bg-purple-900/20 dark:text-purple-300"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-[#6C16C7] text-4xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">Profile Photo</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">This will be displayed on your profile</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#6C16C7] text-white rounded-md hover:bg-purple-700">
                      Upload new photo
                    </button>
                    <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="I'm a finance enthusiast looking to improve my budgeting skills."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-[#6C16C7] text-white rounded-md hover:bg-purple-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Theme Settings Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Appearance</h2>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between light and dark mode</p>
                </div>
                <ThemeToggle className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
