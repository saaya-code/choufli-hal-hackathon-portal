import { CalendarIcon, ClockIcon, MapPinIcon, BookAIcon } from "lucide-react";

const timelineEvents = [
  {
    icon: <CalendarIcon className="h-8 w-8 text-primary" />,
    title: "Registration Opens",
    date: "February 22nd, 2025",
    description: "Begin your learning journey with us",
  },
  {
    icon: <BookAIcon className="h-8 w-8 text-primary" />,
    title: "Online workshops",
    date: "March 3-4th, 2025",
    description: "What's new in tech? Learn from the best",
  },
  {
    icon: <ClockIcon className="h-8 w-8 text-primary" />,
    title: "Hackathon Kickoff",
    date: "March 4th, 2025",
    description: "Challenge announcement at 11:59 PM and lasts 24 hours",
  },

  {
    icon: <MapPinIcon className="h-8 w-8 text-primary" />,
    title: "Pitching & Awards Ceremony",
    date: "March 6th, 2025",
    description: "Break your fast with us, pitch your project and win",
  },
];

export function TimelineSection() {
  return (
    <section id="timeline" className="py-32 bg-accent/5">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Event Timeline
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="relative p-6 pt-14 min-h-[200px] bg-white rounded-lg shadow-lg hover:transform hover:scale-105 transition-transform"
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-secondary/10 p-3 rounded-full">
                {event.icon}
              </div>
              <div className="pt-4 text-center">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-primary font-medium">{event.date}</p>
                <p className="text-muted-foreground mt-2">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
