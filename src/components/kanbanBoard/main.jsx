"use client";

import React, { useState } from 'react';
import {KanbanBoard} from "@/components/kanbanBoard/board";

const Main = () => {
    return (
        <div className="min-h-screen py-10 px-4">
            <KanbanBoard/>
        </div>
    );
};

export default Main;