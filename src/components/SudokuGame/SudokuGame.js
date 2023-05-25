import React, { useState } from 'react';

function SudokuGame() {
    const generateRandomBoard = () => {
        const emptyBoard = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
        fillRandomNumbers(emptyBoard);
        removeRandomNumbers(emptyBoard, 40);
        return emptyBoard;
    };

    const removeRandomNumbers = (board, count) => {
        let remaining = count;
        while (remaining > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                remaining--;
            }
        }
    };

    const fillRandomNumbers = (board) => {
        fillBoard(board, 0, 0);
    };

    const isValidMove = (board, row, col, num) => {
        // Verificar duplicados en fila
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num && i !== col) {
                return false;
            }
        }

        // Verificar duplicados en columna
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num && i !== row) {
                return false;
            }
        }

        // Verificar duplicados en la región 3x3
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
                    return false;
                }
            }
        }

        return true;
    };

    const fillBoard = (board, row, col) => {
        if (row === 9) {
            return true;
        }

        if (col === 9) {
            return fillBoard(board, row + 1, 0);
        }

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(numbers);

        for (const num of numbers) {
            if (isValidMove(board, row, col, num)) {
                board[row][col] = num;

                if (fillBoard(board, row, col + 1)) {
                    return true;
                }

                board[row][col] = 0;
            }
        }

        return false;
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const initialBoard = generateRandomBoard();
    const [board, setBoard] = useState(initialBoard);
    const [isSolved, setIsSolved] = useState(false);

    const updateNumber = (row, col, value) => {
        const newBoard = [...board];
        newBoard[row][col] = value;
        setBoard(newBoard);

        const solved = isBoardSolved(newBoard);
        setIsSolved(solved);
    };

    const isBoardSolved = (board) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return false;
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            const rowSet = new Set();
            const colSet = new Set();
            const regionSet = new Set();

            for (let j = 0; j < 9; j++) {
                const rowValue = board[i][j];
                const colValue = board[j][i];
                const regionValue = board[3 * Math.floor(i / 3) + Math.floor(j / 3)][(i % 3) * 3 + (j % 3)];

                if (rowValue !== 0 && rowSet.has(rowValue)) {
                    return false;
                }
                if (colValue !== 0 && colSet.has(colValue)) {
                    return false;
                }
                if (regionValue !== 0 && regionSet.has(regionValue)) {
                    return false;
                }

                rowSet.add(rowValue);
                colSet.add(colValue);
                regionSet.add(regionValue);
            }
        }

        return true;
    };

    const getQuadrantColorClass = (row, col) => {
        const quadrantRow = Math.floor(row / 3);
        const quadrantCol = Math.floor(col / 3);
        const isEvenQuadrant = (quadrantRow + quadrantCol) % 2 === 0;
        return isEvenQuadrant ? 'quadrant-even' : 'quadrant-odd';
    };

    const getNumberColorClass = (row, col) => {
        const number = board[row][col];
        if (number === 0) {
            return '';
        }
        return isValidMove(board, row, col, number) ? '' : 'invalid';
    };

    const renderBoard = () => {
        return (
            <table className="sudoku-board">
                <tbody>
                    {board.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((number, colIndex) => (
                                <td key={colIndex} className={getQuadrantColorClass(rowIndex, colIndex)}>
                                    <input
                                        min="1"
                                        max="9"
                                        value={number === 0 ? '' : number}
                                        readOnly={number !== 0 && !getNumberColorClass(rowIndex, colIndex).includes('invalid')}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (!isNaN(value) && value >= 1 && value <= 9) {
                                                updateNumber(rowIndex, colIndex, value);
                                            } else {
                                                updateNumber(rowIndex, colIndex, 0);
                                            }
                                        }}
                                        className={getNumberColorClass(rowIndex, colIndex)}
                                        inputMode="numeric"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="">
            <h1>Sudoku de      
                <a href="https://www.linkedin.com/in/emaflores/"> Emanuel Flores</a>
            </h1>
            {renderBoard()}
            {isSolved && <p>¡Tablero resuelto correctamente!</p>}
        </div>
    );
}

export default SudokuGame;
