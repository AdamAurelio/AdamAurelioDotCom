const Resume = () => {
  return (
    <section id="resume" className="py-12 px-4 md:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Resume</h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            Experienced IT professional with over seven years of expertise in
            systems analysis, software development, and application support.
            Proven ability to implement and support critical business
            applications, integrate COTS solutions, and automate processes using
            advanced technologies. Seeking opportunities to contribute technical
            expertise and leadership in a dynamic IT environment.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Programming Languages
              </h3>
              <p className="text-gray-700">
                Python, C#, VB.NET, SQL, PL/SQL, PowerShell
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tools
              </h3>
              <p className="text-gray-700">
                UiPath, Docker, Azure DevOps, Oracle Apex, Microsoft Power
                Platform
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Methodologies
              </h3>
              <p className="text-gray-700">
                Agile, Scrum, CI/CD, DevOps, API Integrations
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Database Technologies
              </h3>
              <p className="text-gray-700">Oracle, Microsoft SQL Server</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Other Skills
              </h3>
              <p className="text-gray-700">
                Application integration, change and release management, system
                analysis, and design
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Professional Experience
          </h2>

          <div className="mb-8 bg-white border-l-4 border-blue-600 pl-6 py-4">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  MidAmerican/Berkshire Hathaway Energy
                </h3>
                <p className="text-gray-600">Des Moines, Iowa</p>
              </div>
              <p className="text-gray-600 font-medium">2015 – Present</p>
            </div>

            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Software Engineer / Oracle PLSQL Developer / Robotic Process
              Automation Developer
            </h4>

            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>
                Provided functional and technical support for critical business
                applications, ensuring seamless operation and resolving complex
                issues.
              </li>
              <li>
                Designed, coded, tested, and maintained moderate to highly
                complex application programs and interfaces, including Oracle
                PL/SQL and .NET-based solutions.
              </li>
              <li>
                Integrated Commercial off the Shelf (COTS) solutions within
                environments with strong change and release management
                processes.
              </li>
              <li>
                Developed a full-stack application for tracking and managing
                Oracle Fusion security access using Python APIs and Oracle SQL
                automation.
              </li>
              <li>
                Delivered advanced business process automation solutions as part
                of the UiPath Center of Excellence.
              </li>
              <li>
                Created and maintained PL/SQL web applications for monitoring
                KPIs, managing employee performance, and supporting
                environmental projects.
              </li>
              <li>
                Built UiPath automations using VB.NET and C#, streamlining
                processes for purchase orders, intercompany billings, and HR
                functions.
              </li>
              <li>
                Contributed to design and implementation of CI/CD workflows for
                RPA automations using Azure DevOps, ensuring efficient
                deployment processes.
              </li>
              <li>
                Administered and enhanced Oracle Apex applications and
                proprietary .NET applications, improving productivity and user
                experience.
              </li>
              <li>
                Consulted with application users to evaluate requests for new or
                modified applications, determining feasibility, cost, and
                compatibility with existing systems.
              </li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Technology Resource Center Analyst I & II
            </h4>

            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>
                Enhanced proprietary VB.NET applications, optimizing internal
                software solutions.
              </li>
              <li>
                Delivered Tier I and Tier II support for mission-critical
                systems, ensuring timely issue resolution.
              </li>
              <li>
                Managed Identity and Access Management protocols within Active
                Directory, improving security and accessibility.
              </li>
              <li>
                Mentored new associates, providing guidance across diverse IT
                landscapes.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Education & Technical Certifications
          </h2>

          <div className="mb-6 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">Drake University</h3>
            <p className="text-gray-600">Des Moines, Iowa</p>
            <p className="text-gray-700">Bachelor of Arts and Sciences</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Certifications
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>CompTIA A+ Certified</strong> | Dec 2013 – 2026
              </li>
              <li>
                <strong>CompTIA Network+ Certified</strong> | May 2014 – 2026
              </li>
              <li>
                <strong>CompTIA Security+ Certified</strong> | May 2017 – 2026
              </li>
              <li>
                <strong>CompTIA Secure Infrastructure Specialist CSIS</strong> |
                May 2017 – 2026
              </li>
              <li>
                <strong>CompTIA IT Operations Specialist CIOS</strong> | May
                2014 – 2026
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Community Involvement
          </h2>

          <div className="mb-6 bg-white border-l-4 border-green-600 pl-6 py-4">
            <div className="flex flex-wrap justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Iowa United Head Coach Select 14UG
                </h3>
              </div>
              <p className="text-gray-600 font-medium">2023 - Present</p>
            </div>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Certified USYS Grassroots coach.</li>
              <li>Led game management and assistant coach development.</li>
              <li>
                Planned and conducted regular player training and matches.
              </li>
              <li>
                Focused on technical, tactical, physical, and mental development
                of players and the team.
              </li>
            </ul>
          </div>

          <div className="mb-6 bg-white border-l-4 border-green-600 pl-6 py-4">
            <div className="flex flex-wrap justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Iowa Asian Alliance Director of Volunteers
                </h3>
              </div>
              <p className="text-gray-600 font-medium">2018</p>
            </div>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>Recruit, manage committee members and volunteers</li>
              <li>Plan, organize, and lead respective committee meetings</li>
              <li>Set committee goals and timelines</li>
            </ul>
          </div>

          <div className="mb-6 bg-white border-l-4 border-green-600 pl-6 py-4">
            <div className="flex flex-wrap justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Walnut Creek Community Church Audio-Visual Technician and Team
                  Lead
                </h3>
              </div>
              <p className="text-gray-600 font-medium">2010 – Present</p>
            </div>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>
                Set up and tear down of equipment to and from requested off-site
                locations
              </li>
              <li>Installation, upgrade, and maintain equipment as needed</li>
              <li>
                Lead and train in audio production for service and special
                events
              </li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Resume;
