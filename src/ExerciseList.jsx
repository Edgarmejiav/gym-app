
const ExerciseList = ({ data }) => {


    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Saved Exercises</h3>

            <div className="space-y-4">
                {/* eslint-disable-next-line react/prop-types */}
                {data?.map((exercise) => (
                    <div key={exercise.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <span className="font-bold text-lg">{exercise.name}</span>
                                <span className="ml-4 text-gray-600">
            {new Date(exercise.created_at).toLocaleDateString()}
                            </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {exercise?.sets?.map((set, index) => (
                                <div key={index} className="bg-white p-2 rounded">
                                    <span className="font-medium">Set {index + 1}:</span>
                                    <span className="ml-2">{set.reps} reps × {set.weight}kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ExerciseList;
