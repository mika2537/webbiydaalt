import CourseCard from "./CourseCard";

const CourseGrid = () => {
  const courses = [
    { id: 1, title: "Математик", symbols: ["∫dx","E=mc²","1+1=2","V=s/t","H₂O","ABC","⊞","⚬","?"] },
    { id: 2, title: "Программчлалын үндэс", symbols: ["💡","ABC","?","∫dx","H₂O","⊞","E=mc²","1+1=2","V=s/t"] },
    { id: 3, title: "Веб систем ба технологи", symbols: ["∫dx","H₂O","⊞","E=mc²","1+1=2","V=s/t","❌⭕","⚬","?"] },
    { id: 4, title: "Дискрет", symbols: ["ABC","⊞","⚬","1+1=2","?","💡","V=s/t","∫dx","E=mc²"] },
    { id: 5, title: "Хорт программын шинжилгээ", symbols: ["⊞","E=mc²","1+1=2","V=s/t","❌⭕","⚬","ABC","?","💡"] },
    { id: 6, title: "Физик", symbols: ["⊞","E=mc²","1+1=2","V=s/t","H₂O","∫dx","?","ABC","⚬"] },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,200 Q250,100 500,200 T1000,200 L1000,400 Q750,500 500,400 T0,400 Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M0,600 Q250,500 500,600 T1000,600 L1000,800 Q750,900 500,800 T0,800 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 3 x 2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-6xl mx-auto">
        {courses.map((course, idx) => (
          <CourseCard
            key={course.id}
            course={course}
            noBottom={idx >= 3}   
          />
        ))}
      </div>
    </div>
  );
};

export default CourseGrid;
