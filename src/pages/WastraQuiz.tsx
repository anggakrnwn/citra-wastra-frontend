import React, { useState } from "react";
import { MOTIFS } from "../assets/data/dataset";
import { useWastra } from "../context/WastraContext";
import { useNavigate } from "react-router-dom";

interface QuizUser {
  name: string;
  score: number;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const ContributorArticles: React.FC = () => {
  const { user } = useWastra();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<QuizUser[]>([]);

  const questions = shuffle(MOTIFS).slice(0, 5);
  const current = questions[questionIndex];

  const handleAnswer = (answer: string) => {
    setSelected(answer);
    const isCorrect = answer === current.region || answer === current.name;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setTimeout(() => {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setIsFinished(true);
        if (user) {
          const finalScore = isCorrect ? score + 1 : score;
          const newEntry = { name: user.name, score: finalScore };
          setLeaderboard((prev) =>
            [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)
          );
        }
      }
    }, 1000);
  };

  // Jika user belum login secara global
  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Silakan Login untuk Mengakses Kuis</h2>
        <p className="mb-4 text-gray-600">Anda perlu login terlebih dahulu untuk memainkan kuis ini.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
        >
          Login di Sini
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Kuis Selesai!</h2>
          <p className="text-lg text-gray-700">
            Skor Anda: <span className="font-bold text-amber-600">{score}</span> / {questions.length}
          </p>
        </div>
        
        <button
          onClick={() => {
            setScore(0);
            setQuestionIndex(0);
            setSelected(null);
            setIsFinished(false);
          }}
          className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors mb-6"
        >
          Main Lagi
        </button>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Papan Skor</h3>
          {leaderboard.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 font-medium text-gray-700 pb-2 border-b">
                <div>Nama</div>
                <div className="text-right">Skor</div>
              </div>
              {leaderboard.map((u, i) => (
                <div key={i} className={`grid grid-cols-2 py-2 ${i !== leaderboard.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500 mr-2">{i + 1}.</span>
                    <span className={i === 0 ? "font-semibold text-amber-600" : "text-gray-700"}>
                      {u.name}
                    </span>
                  </div>
                  <div className="text-right font-medium text-gray-800">
                    {u.score}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada data skor.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl text-center">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Pertanyaan {questionIndex + 1} dari {questions.length}
        </h2>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {user.name}
        </span>
      </div>
      
      <img
        src={current.image}
        alt={current.name}
        className="h-48 w-full object-cover rounded-lg mb-4 border"
      />
      <p className="mb-3 font-medium text-gray-700">Tebak asal daerah atau nama motif ini:</p>

      <div className="grid gap-3">
        {shuffle([
          current.region,
          current.name,
          ...shuffle(MOTIFS).slice(0, 2).map((m) => m.region),
        ]).map((opt, idx) => (
          <button
            key={idx}
            disabled={!!selected}
            onClick={() => handleAnswer(opt)}
            className={`p-3 rounded-lg border transition-all duration-200 ${
              selected === opt
                ? opt === current.region || opt === current.name
                  ? "bg-green-500 text-white border-green-600"
                  : "bg-red-500 text-white border-red-600"
                : "bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContributorArticles;