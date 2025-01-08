import {useEffect, useState} from 'react';
import {Plus, Minus, Trash2} from 'lucide-react';
import supabase from "./supabaseClient.js";
import {exercises, repOptions, weightOptions} from "./const.js";
import ExerciseList from "./ExerciseList.jsx";
import supabaseClient from "./supabaseClient.js";

export const GymTracker = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const today = new Date().toISOString().split('T')[0];


    const fetchData = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('ejercicios')
                .select()
                .gte('created_at', `${today}T00:00:00.000Z`)
                .lte('created_at', `${today}T23:59:59.999Z`);
            console.log(data);
            if (error) throw error;
            setData(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };



    const [newExercise, setNewExercise] = useState({
        name: '',
        sets: []
    });

    const [tempSet, setTempSet] = useState({
        reps: 1,
        weight: 10
    });

    const addSet = () => {
        setNewExercise(prev => ({
            ...prev,
            sets: [...prev.sets, {...tempSet, id: Date.now()}]
        }));
        setTempSet({reps: 1, weight: 10});
    };
    const removeSet = (setId) => {
        setNewExercise(prev => ({
            ...prev,
            sets: prev.sets.filter(set => set.id !== setId)
        }));
    };

    const addExercise = async () => {
        try {
            if (!newExercise.name.trim()) {
                alert('El nombre no puede estar vacío.');
                return
            }

            console.log(newExercise)
            if ( newExercise.sets.length === 0) {
                alert('Debe haber al menos una serie.');
                return
            }
            const { data, error } = await supabase
                .from('ejercicios')
                .insert([
                    {
                        name: newExercise.name,
                        sets: newExercise.sets
                    }
                ])
                .select(); // Selecciona el registro insertado

            if (error) {
                throw new Error(error.message);
            }

            setNewExercise({
                name: '',
                sets: []
            });
            alert('Ejercicio agregado correctamente');
            console.log('Ejercicio agregado:', data); // Imprime el registro insertado
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    useEffect(() => {
        fetchData();
    }, [newExercise]);
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div>
                <div className="text-2xl font-bold text-center">Exercise and Set Registration</div>
            </div>
            <div>
                <div className="space-y-6">
                    {/* Basic exercise information */}
                    <div className="flex gap-4">
                        <select
                            value={newExercise.name}
                            onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                            className="p-2 border rounded flex-grow"
                        >
                            {Object.values(exercises).map((exercise, index) => (
                                <option key={index} value={exercise.name}>
                                    {exercise.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Current set control */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">New Set:</h3>

                        {/* Rep selector */}
                        <div className="mb-4">
                            <h4 className="text-sm text-gray-600 mb-2">Reps:</h4>
                            <div className="flex flex-wrap gap-2">
                                {repOptions.map((rep) => (
                                    <button
                                        key={rep}
                                        onClick={() => setTempSet({...tempSet, reps: rep})}
                                        className={`px-4 py-2 rounded-full ${
                                            tempSet.reps === rep
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {rep}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={() => setTempSet(prev => ({
                                        ...prev,
                                        reps: Math.max(1, prev.reps - 1)
                                    }))}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                >
                                    <Minus size={20}/>
                                </button>
                                <span className="text-xl font-bold min-w-[3rem] text-center">
                                    {tempSet.reps}
                                </span>
                                <button
                                    onClick={() => setTempSet(prev => ({
                                        ...prev,
                                        reps: prev.reps + 1
                                    }))}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                >
                                    <Plus size={20}/>
                                </button>
                            </div>
                        </div>

                        {/* Weight selector */}
                        <div className="mb-4">
                            <h4 className="text-sm text-gray-600 mb-2">Weight (kg):</h4>
                            <div className="flex flex-wrap gap-2">
                                {weightOptions.map((weight) => (
                                    <button
                                        key={weight}
                                        onClick={() => setTempSet({...tempSet, weight: weight})}
                                        className={`px-4 py-2 rounded-full ${
                                            tempSet.weight === weight
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {weight}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={() => setTempSet(prev => ({
                                        ...prev,
                                        weight: Math.max(0, prev.weight - 2.5)
                                    }))}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                >
                                    <Minus size={20}/>
                                </button>
                                <span className="text-xl font-bold min-w-[4rem] text-center">
                                    {tempSet.weight}
                                </span>
                                <button
                                    onClick={() => setTempSet(prev => ({
                                        ...prev,
                                        weight: prev.weight + 2.5
                                    }))}
                                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                                >
                                    <Plus size={20}/>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={addSet}
                            className="w-full bg-green-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
                        >
                            <Plus size={20}/> Add Set
                        </button>
                    </div>

                    {/* Added sets */}
                    {newExercise.sets.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-3">Exercise Sets:</h3>
                            <div className="space-y-2">
                                {newExercise?.sets?.map((set, index) => (
                                    <div key={set.id}
                                         className="flex items-center justify-between bg-white p-3 rounded">
                                        <div className="flex gap-4">
                                            <span className="font-medium">Set {index + 1}:</span>
                                            <span>{set.reps} reps</span>
                                            <span>{set.weight} kg</span>
                                        </div>
                                        <button
                                            onClick={() => removeSet(set.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={addExercise}
                        className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 text-lg"
                        // disabled={!newExercise.name || newExercise.sets.length === 0}
                    >
                        <Plus size={24}/> Save Full Exercise
                    </button>


                </div>
            </div>
            <ExerciseList data={data}/>
        </div>
    );
};

export default GymTracker;
