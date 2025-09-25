import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle,
  Search,
  Send,
  PaperclipIcon,
  MoreVertical,
  Star,
  Reply,
  Forward,
  Archive,
  Trash2
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "student" | "admin" | "parent";
  senderAvatar?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  courseContext?: string;
  replyToId?: string;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  subject: string;
}

// Demo data
const demoMessages: Message[] = [
  {
    id: "1",
    senderId: "teacher-1",
    senderName: "Dr. Sarah Johnson",
    senderRole: "teacher",
    senderAvatar: "",
    subject: "Assignment Feedback - Algebraic Word Problems",
    content: "Great work on your recent assignment! Your approach to solving the word problems was methodical and well-explained. I particularly liked how you showed your work step by step. For future assignments, try to double-check your final answers by substituting back into the original equations.",
    timestamp: "2025-01-05T14:30:00Z",
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    courseContext: "Introduction to Mathematics"
  },
  {
    id: "5",
    senderId: "teacher-3",
    senderName: "Ms. Emily Rodriguez",
    senderRole: "teacher",
    senderAvatar: "",
    subject: "Parent Conference - Emma's Progress in Biology",
    content: "Dear Mr. and Mrs. Wilson,\n\nI hope this message finds you well. I wanted to reach out to discuss Emma's progress in Biology this semester. Overall, Emma has been performing exceptionally well - she consistently demonstrates strong understanding of complex concepts and actively participates in class discussions.\n\nHowever, I've noticed she's been struggling with the lab report formatting requirements. While her experimental understanding is excellent, her written reports could benefit from more structured organization. I'd like to schedule a brief conference to discuss some strategies we can implement both at school and at home to help her excel in this area.\n\nWould you be available for a 15-minute phone call this week? I'm free Tuesday or Thursday after 3:30 PM. Emma is a pleasure to have in class, and I'm confident that with some focused support, she'll master these skills quickly.\n\nBest regards,\nMs. Rodriguez\nBiology Teacher\nRoom 204, ext. 2156",
    timestamp: "2025-01-06T09:15:00Z",
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    courseContext: "Advanced Biology"
  },
  {
    id: "6",
    senderId: "parent-1",
    senderName: "Emma's Parents",
    senderRole: "parent",
    senderAvatar: "",
    subject: "Re: Parent Conference - Emma's Progress in Biology",
    content: "Dear Ms. Rodriguez,\n\nThank you so much for reaching out and for the detailed update on Emma's progress. We're thrilled to hear that she's doing well overall and actively participating in class discussions - that speaks volumes about your engaging teaching style!\n\nWe really appreciate you bringing the lab report formatting to our attention. Emma has mentioned the reports at home, and we can definitely see where some additional structure would be helpful. We've noticed she sometimes rushes through the written portions when she's excited about her discoveries.\n\nWe would love to schedule that conference. Thursday after 3:30 PM works perfectly for us - would 4:00 PM be convenient? We can be reached at this number or 555-0198 if you prefer to call.\n\nWe'd also like to know if there are any specific formatting templates or examples you recommend for the lab reports. We're happy to work with Emma at home on organization strategies.\n\nThank you again for your dedication to Emma's success. She really enjoys your class and often shares interesting biology facts at dinner!\n\nBest regards,\nMr. and Mrs. Wilson\n(Emma's Parents)",
    timestamp: "2025-01-06T15:45:00Z",
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    courseContext: "Advanced Biology",
    replyToId: "5"
  },
  {
    id: "2",
    senderId: "admin-1", 
    senderName: "Academic Coordinator",
    senderRole: "admin",
    subject: "Course Schedule Update",
    content: "Please note that next week's Advanced Physics lab session has been moved from Wednesday to Friday at 2:00 PM. All students enrolled in the course will receive calendar updates shortly.",
    timestamp: "2025-01-05T10:15:00Z",
    isRead: true,
    isStarred: true,
    hasAttachment: false
  },
  {
    id: "3",
    senderId: "student-1",
    senderName: "Alex Chen",
    senderRole: "student",
    subject: "Study Group Formation",
    content: "Hi everyone! I'm organizing a study group for the upcoming Creative Writing Workshop peer review session. We're planning to meet this Saturday at 3 PM in the library. Please let me know if you're interested in joining!",
    timestamp: "2025-01-04T16:45:00Z",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    courseContext: "Creative Writing Workshop"
  },
  {
    id: "4",
    senderId: "teacher-2",
    senderName: "Prof. Michael Roberts",
    senderRole: "teacher",
    subject: "Lab Report Guidelines",
    content: "Attached you'll find the detailed guidelines for your upcoming physics lab report. Please review the formatting requirements and submission deadlines carefully. The report is due next Friday before midnight.",
    timestamp: "2025-01-04T09:20:00Z",
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    courseContext: "Advanced Physics"
  }
];

const demoConversations: Conversation[] = [
  {
    id: "1",
    participants: [
      { id: "teacher-1", name: "Dr. Sarah Johnson", role: "Teacher", avatar: "" }
    ],
    lastMessage: "Great work on your recent assignment!",
    lastMessageTime: "2025-01-05T14:30:00Z",
    unreadCount: 1,
    isGroup: false,
    subject: "Assignment Feedback"
  },
  {
    id: "2",
    participants: [
      { id: "student-1", name: "Alex Chen", role: "Student", avatar: "" },
      { id: "student-2", name: "Emma Davis", role: "Student", avatar: "" }
    ],
    lastMessage: "Sounds great! I'll bring my notes.",
    lastMessageTime: "2025-01-04T18:20:00Z",
    unreadCount: 0,
    isGroup: true,
    subject: "Study Group Discussion"
  }
];

export default function MessagesPage() {
  const [selectedView, setSelectedView] = useState<"inbox" | "conversations">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const { data: messages = demoMessages } = useQuery({
    queryKey: ["/api/messages"],
    select: (data) => data || demoMessages
  });

  const { data: conversations = demoConversations } = useQuery({
    queryKey: ["/api/conversations"],
    select: (data) => data || demoConversations
  });

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "student": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "parent": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header with breadcrumbs and back button */}
      <PageHeader 
        title="Messages" 
        description="Communicate with teachers, students, and administrators"
      />
      
      <div className="mx-auto max-w-7xl p-4">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Badge className="h-5 w-5 bg-red-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Starred</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{starredCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversations</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{conversations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex space-x-2">
            <Button
              variant={selectedView === "inbox" ? "default" : "outline"}
              onClick={() => setSelectedView("inbox")}
              data-testid="button-inbox"
            >
              Inbox
            </Button>
            <Button
              variant={selectedView === "conversations" ? "default" : "outline"}
              onClick={() => setSelectedView("conversations")}
              data-testid="button-conversations"
            >
              Conversations
            </Button>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => setIsComposing(true)}
            data-testid="button-compose"
          >
            <Send className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedView === "inbox" ? "Inbox" : "Conversations"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {selectedView === "inbox" ? (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b last:border-b-0 ${
                          selectedMessage === message.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } ${!message.isRead ? 'bg-blue-25 dark:bg-blue-950/30' : ''}`}
                        onClick={() => setSelectedMessage(message.id)}
                        data-testid={`message-${message.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback className="text-xs">
                              {getInitials(message.senderName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm ${!message.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white truncate`}>
                                {message.senderName}
                              </p>
                              <div className="flex items-center space-x-1">
                                {message.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                                {message.hasAttachment && <PaperclipIcon className="h-3 w-3 text-gray-400" />}
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getRoleColor(message.senderRole)}`}>
                                {message.senderRole}
                              </Badge>
                              {message.courseContext && (
                                <span className="text-xs text-gray-500 truncate">
                                  • {message.courseContext}
                                </span>
                              )}
                            </div>
                            
                            <p className={`text-sm ${!message.isRead ? 'font-medium' : ''} text-gray-900 dark:text-white mt-1 truncate`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b last:border-b-0"
                        data-testid={`conversation-${conversation.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex -space-x-1">
                            {conversation.participants.slice(0, 2).map((participant) => (
                              <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                                <AvatarImage src={participant.avatar} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(participant.name)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {conversation.subject}
                              </p>
                              <div className="flex items-center space-x-2">
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-red-600 text-white text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(conversation.lastMessageTime)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {conversation.participants.map(p => p.name).join(', ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader>
                  {(() => {
                    const message = messages.find(m => m.id === selectedMessage);
                    if (!message) return null;
                    
                    return (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback>
                              {getInitials(message.senderName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{message.subject}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                From: {message.senderName}
                              </span>
                              <Badge className={`text-xs ${getRoleColor(message.senderRole)}`}>
                                {message.senderRole}
                              </Badge>
                              {message.courseContext && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  • {message.courseContext}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" data-testid="button-star">
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" data-testid="button-more">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </CardHeader>
                
                <CardContent>
                  {(() => {
                    const message = messages.find(m => m.id === selectedMessage);
                    if (!message) return null;
                    
                    return (
                      <>
                        <div className="prose max-w-none dark:prose-invert mb-6">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {message.hasAttachment && (
                          <div className="border rounded-lg p-4 mb-6">
                            <div className="flex items-center space-x-2">
                              <PaperclipIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                lab-guidelines.pdf
                              </span>
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button data-testid="button-reply">
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                          <Button variant="outline" data-testid="button-forward">
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </Button>
                          <Button variant="outline" data-testid="button-archive">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Select a message
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a message from the list to view its contents
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Compose Modal */}
        {isComposing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To:</label>
                  <Input placeholder="Enter recipient..." data-testid="input-to" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject:</label>
                  <Input placeholder="Enter subject..." data-testid="input-subject" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message:</label>
                  <Textarea 
                    placeholder="Type your message..." 
                    rows={6}
                    data-testid="textarea-message"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" data-testid="button-attach">
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsComposing(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button data-testid="button-send">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}