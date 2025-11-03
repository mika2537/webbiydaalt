const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Chalkboard Section */}
            <div className="bg-green-900 p-8 relative overflow-hidden">
                {/* Chalkboard background texture */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,.1) 2px, rgba(255,255,255,.1) 4px)
                        `
                    }}></div>
                </div>
                
                {/* Chalk-drawn symbols */}
                <div className="relative grid grid-cols-3 gap-4 text-white items-center justify-items-center">
                    {course.symbols.map((symbol, index) => (
                        <div
                            key={index}
                            className="text-3xl font-bold opacity-90"
                            style={{
                                filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.5))',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                        >
                            {symbol}
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Title Section */}
            <div className="bg-gray-200 py-4 px-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
            </div>
        </div>
    );
};

export default CourseCard;

