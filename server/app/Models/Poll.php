<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Poll extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "polls";

    protected $fillable = [
        'pollid',
        'pollname',
        'description', 
        'participant_grade', 
        'application_start',
        'application_end', 
        'validation_end', 
        'voting_start', 
        'voting_end', 
        'requirements', 
        'qualifications', 
        'poll_status',
        'admin_id',
        'admin_name',
        'created_by', 
        'updated_by'
    ];
}
